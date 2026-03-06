import { defineConfig } from "@rslib/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  lib: [
    {
      format: "esm",
      bundle: false,
      output: {
        distPath: {
          root: "./dist/esm",
        },
      },
      dts: false,
    },
    {
      format: "cjs",
      bundle: false,
      output: {
        distPath: {
          root: "./dist/cjs",
        },
      },
      dts: false,
    },
    {
      format: "esm",
      bundle: false,
      dts: {
        distPath: "./dist/types",
      },
      output: {
        distPath: {
          root: "./dist/types",
        },
      },
    },
  ],
  output: {
    target: "web",
  },
  plugins: [pluginReact()],
});
