# SAM Rewrite & Hardening — Phased Plan

**Branch:** `dwesolow/sam-improvements` (off `main`, separate PR)

**Goal:** Fix `memory access out of bounds`, the `/Resize_1` JSEP kernel failure, and
memory leaks by replacing the over-engineered error handling in `session.ts` /
`segment-anything.ts` with a small, well-understood design.

> **Note:** The "current flow" / "over-engineered error handling" this plan refers to is
> the code introduced in PR https://github.com/MarkRedeman/geti-ui/pull/43 (branch
> `jvilaca/smart-tools-4`), which is what the investigation was based on. This
> `dwesolow/sam-improvements` branch instead starts clean from `main` (the pre-PR
> baseline), so descriptions of the 336-line `session.ts` FIFO-queue/poison machinery
> reference that PR, not the files currently on this branch.

## Root cause summary

The consuming app runs `encode(current)` + `decode(current)` + inference for the
displayed image, **and** `encode(next)` + `decode(next)` (prefetch) concurrently.

- The encoder `Session` and decoder `Session` both live inside **one**
  `SegmentAnythingModel`, built once by `SegmentAnythingModelWrapper` in **a single
  worker**. They share the **same global `ort.env.wasm`**, the **same WASM linear
  memory/heap**, and the **same global JSEP/WebGPU backend**.
- onnxruntime-web `run()` is **not re-entrant**. Concurrent `encode(next)` overlapping
  `decode(current)` corrupts the shared heap → `memory access out of bounds` +
  `Failed to run JSEP kernel`.
- The existing FIFO queue (in `session.ts`) serializes only **within** a single
  `Session`; it does **nothing across** encoder/decoder — so it does not fix the OOB.
- The `/Resize_1` failure is a shape-integrity gap: the encoder tensor shape is
  hard-coded `[1,3,1024,1024]` with no validation that the blob length matches, and
  dimension math (`Math.ceil`/`Math.round`) is unguarded for degenerate images.
- ORT tensors are never `.dispose()`'d (GPU-backed on WebGPU EP → GPU leak per
  encode/decode); downgraded/hung sessions are never `release()`d.

**Decision:** Serialize with a **single model-wide run lock** (mutex/promise-chain) in
`SegmentAnythingModel` wrapping every `session.run()` (encoder + decoder). This is the
only provable OOB fix short of moving encoder/decoder into separate workers (deferred
as a future optimization).

**Test harness:** `@rstest/core` with `rstest.mock('onnxruntime-web', ...)` (as used in
`session.test.ts` / `segment-anything.test.ts`). Command: `npm run test`.

---

## Phase 0 — Branch & baseline safety net

**Why:** Isolate this work in its own PR and capture current behavior before rewriting,
so regressions are visible.

**Current flow:** WIP lives on `jvilaca/smart-tools-4`; the rewrite starts clean from
`main` (keeps pre/post-processing, drops the complex session/orchestrator code).

**Expected change:** New branch; establish a green baseline.

- [x] Create `dwesolow/sam-improvements` from `main`.
- [x] Run `npm run test` + `npm run type-check` → record baseline (green before edits).
- [x] Confirm `main`'s `session.ts` state so we know exactly what we're replacing.

---

## Phase 1 — Serialize all ORT runs (THE OOB fix)

**Why:** onnxruntime-web `run()` is not re-entrant and encoder+decoder share one WASM
heap/JSEP context in one worker. Concurrent `encode(next)` + `decode(current)` corrupts
the heap → `memory access out of bounds` + `Failed to run JSEP kernel`.

**Current flow:** A ~250-line FIFO queue in `session.ts` serializes only _within_ one
`Session`; nothing serializes across encoder/decoder. Global `env.wasm.*` is mutated per
session create with no guard.

**Expected change:** Replace the queue with a **single model-wide async mutex** (a simple
promise-chain) in `SegmentAnythingModel` that wraps every `session.run()` (encoder and
decoder). Set global `env.wasm.*` **once** at first init, never re-mutate mid-flight.

- [x] Test: two `processEncoder` calls issued concurrently → the second `run()` starts
      only after the first resolves.
- [x] Test: `processEncoder` + `processDecoder` issued concurrently → runs serialized
      across the two sessions (assert no overlap).
- [x] Test: mutex releases on rejection (a failing run does not deadlock later runs).
- [x] Test: `env.wasm.numThreads` is set once and not rewritten on a second session
      creation.

---

## Phase 2 — Classify errors: recoverable vs fatal

**Why:** The current code poisons/tears down the session on _any_ `run()` rejection — a
benign bad-shape or missing-output error is treated like heap corruption, causing
needless rebuilds and doomed retries.

**Current flow:** `runOnce` calls `poison()` on every rejection/timeout;
`runWithRecovery` retries once regardless of error nature.

**Expected change:** Introduce a small classifier — **fatal** (WASM OOB / JSEP kernel /
initWasm / device-lost / timeout → rebuild session) vs **recoverable/benign**
(validation, bad shape, missing output, OpenCV errors → propagate, no teardown). Only
fatal errors trigger recovery. Unknown/ambiguous errors default to fatal (fail safe).

- [x] Test: a WASM/JSEP-style error message → classified fatal → triggers rebuild.
- [x] Test: a validation/pre-processing error → benign → propagates unchanged, session
      untouched (no reset/rebuild).
- [x] Test: a run timeout → classified fatal.
- [x] Test: an unknown/ambiguous error → default fatal policy asserted.

---

## Phase 3 — Simplify session lifecycle & WebGPU→CPU recovery

**Why:** `generation` counter is overloaded as FIFO key + poison epoch, in-flight state
is triple-tracked (`queue`/`runningGenerations`/`activeRuns`), and fire-and-forget
release makes the code unmaintainable. Downgraded WebGPU sessions are never released.

**Current flow:** `session.ts` (336 lines) with `queue`/`runningGenerations`/
`activeRuns`/`poisoned`/`generation`; `segment-anything.ts` has `initializations`/
`recoveries` maps + regex EP sniffing.

**Expected change:** Slim `Session` to: `init`, `run` (behind model mutex), `reset(EPs?)`,
`release`, `inputNames`/`outputNames`, `isHealthy`. Keep the WebGPU→CPU downgrade (real,
needed per `wasm-utils.ts`) but make it a single explicit path. Deduplicate concurrent
init/recovery with one in-flight promise each.

- [x] Test: concurrent `init` calls share one initialization.
- [x] Test: fatal WebGPU error → one shared CPU replacement across concurrent callers.
- [x] Test: recovery retries the op exactly once, then propagates a second failure.
- [x] Test: `reset()` before `init()` throws a clear error.

---

## Phase 4 — Resource disposal / fix memory leaks

**Why:** Every encode/decode leaks ORT tensors; on the WebGPU EP the output tensors are
GPU-backed and leak GPU memory each call — amplified by the 2×-encode prefetch pattern.
Downgraded sessions are never `release()`d.

**Current flow:** No `.dispose()` on any tensor; `getData()` downloads but never frees;
old sessions leaked on downgrade/hang.

**Expected change:** Dispose input tensors after `run()` and output tensors after
`getData()` in encoder (`segment-anything-encoder.ts`) and decoder
(`segment-anything-decoder.ts`) via `try/finally`. `release()` the old session on
WebGPU→CPU downgrade.

- [x] Test: encoder disposes input + output tensors after materializing data.
- [x] Test: decoder disposes all feed tensors + output tensors.
- [x] Test: WebGPU→CPU downgrade calls `release()` on the replaced session.
- [x] Test: disposal still happens when `run()` rejects (finally path).

---

## Phase 5 — Shape integrity & input validation (the `/Resize_1` fix)

**Why:** The encoder tensor shape is hard-coded `[1,3,1024,1024]` with no check that the
blob length matches; degenerate/0/extreme-aspect images produce `NaN`/`0` dims that only
fail deep inside the model's Resize kernel. Decoder `orig_im_size` can contain `0`.

**Current flow:** `pre-processing.ts` builds the Tensor from `config.size` regardless of
the actual blob; `resizeImage` uses `Math.ceil(rows*scale)` with no guards.

**Expected change:** Validate `ImageData` (non-zero, finite width/height) at entry;
assert the tensor shape against the actual blob length (`data.length === 3*size*size`);
clamp resized dims to ≥1; guard decoder `orig_im_size` ≥1. Throw a clear,
benign-classified error early instead of a cryptic Resize failure.

- [x] Test: zero-width or zero-height `ImageData` → clear validation error before `run()`.
- [x] Test: blob-length vs declared-shape mismatch → descriptive error (no bad Tensor).
- [x] Test: extreme aspect ratio (e.g. 4000×1) → resized dims ≥1, shape stays
      `[1,3,1024,1024]`.
- [x] Test: decoder `orig_im_size` never contains `0` for small images.

---

## Phase 6 — Defensive decoder/encoder output handling

**Why:** Encoder reads `outputNames[0]` and decoder reads literal `masks`/
`iou_predictions` keys with no guards; a missing/renamed output throws an opaque
`TypeError` that then gets misclassified and poisons the session.

**Current flow:** `segment-anything-encoder.ts` and `segment-anything-decoder.ts` index
outputs unchecked.

**Expected change:** Null-check output tensors by name; throw explicit,
benign-classified errors (`"encoder produced no output"` / `"decoder missing 'masks'
output"`).

- [x] Test: encoder with empty output map → descriptive benign error (not poisoned).
- [x] Test: decoder missing `masks` → descriptive benign error.
- [x] Test: empty-prompt decode path still produces a valid (possibly empty) result.

---

## Phase 7 — Integration & regression tests (the reported bug)

**Why:** Phases 1–6 must jointly reproduce-then-prevent the user's exact symptoms.

**Current flow:** Tests mock ORT per-file; no test exercises the concurrent encode+decode
race that caused OOB.

**Expected change:** Add integration-style tests against mocked ORT modeling the app's
prefetch usage.

You must not test the implementation, must test the expected behavior. Must cover edge cases, don't duplicate tests.

- [x] Test: `encode(current) → decode(current)` while `encode(next)` is issued mid-decode
      → assert full serialization (the OOB-repro guard).
- [x] Test: fatal error mid-sequence recovers once and following calls succeed.
- [x] Test: 50–100 interleaved encode/decode calls in a loop → all serialized, no
      unhandled rejections (deterministic stress guard).

---
