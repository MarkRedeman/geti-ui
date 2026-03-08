// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import {
  Accordion,
  Card,
  Disclosure,
  DisclosurePanel,
  DisclosureTitle,
  Divider,
  Flex,
  Grid,
  View,
  Well,
} from '@geti/ui';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <Flex direction="column" gap="size-50" marginBottom="size-200">
    <h2
      style={{
        margin: 0,
        fontSize: 'var(--spectrum-global-dimension-font-size-400)',
        fontWeight: 700,
        color: 'var(--spectrum-global-color-gray-800)',
        letterSpacing: '0.01em',
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          margin: 0,
          fontSize: 'var(--spectrum-global-dimension-font-size-75)',
          color: 'var(--spectrum-global-color-gray-600)',
        }}
      >
        {subtitle}
      </p>
    )}
    <Divider size="S" marginTop="size-100" />
  </Flex>
);

const SubLabel = ({ children }: { children: string }) => (
  <p
    style={{
      margin: '0 0 4px 0',
      fontSize: 'var(--spectrum-global-dimension-font-size-50)',
      fontWeight: 600,
      color: 'var(--spectrum-global-color-gray-500)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    }}
  >
    {children}
  </p>
);

const cellStyle = {
  background: 'var(--spectrum-global-color-blue-400)',
  padding: '8px 16px',
  textAlign: 'center' as const,
  color: 'white',
  borderRadius: 4,
};

// ---------------------------------------------------------------------------
// Main example component
// ---------------------------------------------------------------------------

export function LayoutsKitchenSinkExample() {
  return (
    <View padding="size-400" width="100%">
      <Flex direction="column" gap="size-400">
        <View>
          <h1
            style={{
              margin: '0 0 4px 0',
              fontSize: 'var(--spectrum-global-dimension-font-size-600)',
              fontWeight: 800,
              color: 'var(--spectrum-global-color-gray-900)',
            }}
          >
            Layouts — Kitchen Sink
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--spectrum-global-dimension-font-size-100)',
              color: 'var(--spectrum-global-color-gray-600)',
            }}
          >
            Showcase of all layout components: accordion, card, disclosure, flex, grid, and well.
          </p>
        </View>

        <Divider size="L" />

        {/* ── Accordion ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Accordion"
            subtitle="default, multiple-expanded, and quiet variants"
          />
          <Flex direction="row" gap="size-400" wrap alignItems="start">
            <View minWidth="size-4600">
              <SubLabel>Default (single expand)</SubLabel>
              <Accordion>
                <Disclosure>
                  <DisclosureTitle>Section One</DisclosureTitle>
                  <DisclosurePanel>
                    <p>Content for section one.</p>
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure>
                  <DisclosureTitle>Section Two</DisclosureTitle>
                  <DisclosurePanel>
                    <p>Content for section two.</p>
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure>
                  <DisclosureTitle>Section Three</DisclosureTitle>
                  <DisclosurePanel>
                    <p>Content for section three.</p>
                  </DisclosurePanel>
                </Disclosure>
              </Accordion>
            </View>
            <View minWidth="size-4600">
              <SubLabel>Multiple expanded</SubLabel>
              <Accordion allowsMultipleExpanded>
                <Disclosure>
                  <DisclosureTitle>First Item</DisclosureTitle>
                  <DisclosurePanel>
                    <p>First item content — stays open when others open.</p>
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure>
                  <DisclosureTitle>Second Item</DisclosureTitle>
                  <DisclosurePanel>
                    <p>Second item content.</p>
                  </DisclosurePanel>
                </Disclosure>
              </Accordion>
            </View>
            <View minWidth="size-4600">
              <SubLabel>Quiet</SubLabel>
              <Accordion isQuiet>
                <Disclosure>
                  <DisclosureTitle>Quiet Section A</DisclosureTitle>
                  <DisclosurePanel>
                    <p>Quiet accordion panel A.</p>
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure>
                  <DisclosureTitle>Quiet Section B</DisclosureTitle>
                  <DisclosurePanel>
                    <p>Quiet accordion panel B.</p>
                  </DisclosurePanel>
                </Disclosure>
              </Accordion>
            </View>
          </Flex>
        </View>

        {/* ── Card ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Card"
            subtitle="default, selectable, selected, and disabled states"
          />
          <Flex direction="row" gap="size-200" wrap alignItems="start">
            <View>
              <SubLabel>Default</SubLabel>
              <Card aria-label="Model card">
                <div>
                  <strong>Model Name</strong>
                  <p style={{ margin: 0, fontSize: '0.85em' }}>Detection · 94.2% accuracy</p>
                </div>
              </Card>
            </View>
            <View>
              <SubLabel>Selectable</SubLabel>
              <Card aria-label="Select project" onPress={() => {}}>
                <div>
                  <strong>Project Alpha</strong>
                  <p style={{ margin: 0, fontSize: '0.85em' }}>Classification · 3 tasks</p>
                </div>
              </Card>
            </View>
            <View>
              <SubLabel>Selected</SubLabel>
              <Card aria-label="Selected project" isSelected onPress={() => {}}>
                <div>
                  <strong>Project Beta</strong>
                  <p style={{ margin: 0, fontSize: '0.85em' }}>Detection · 5 tasks</p>
                </div>
              </Card>
            </View>
            <View>
              <SubLabel>Disabled</SubLabel>
              <Card aria-label="Disabled project" isDisabled onPress={() => {}}>
                <div>
                  <strong>Project Gamma</strong>
                  <p style={{ margin: 0, fontSize: '0.85em' }}>Segmentation · unavailable</p>
                </div>
              </Card>
            </View>
          </Flex>
        </View>

        {/* ── Disclosure ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Disclosure"
            subtitle="collapsed, expanded, quiet, and disabled states"
          />
          <Flex direction="row" gap="size-400" wrap alignItems="start">
            <View minWidth="size-4600">
              <SubLabel>Default (collapsed)</SubLabel>
              <Disclosure>
                <DisclosureTitle>Section Title</DisclosureTitle>
                <DisclosurePanel>
                  <p>This is the collapsible content of the disclosure panel.</p>
                </DisclosurePanel>
              </Disclosure>
            </View>
            <View minWidth="size-4600">
              <SubLabel>Expanded</SubLabel>
              <Disclosure isExpanded>
                <DisclosureTitle>Expanded Section</DisclosureTitle>
                <DisclosurePanel>
                  <p>This panel is open by default.</p>
                </DisclosurePanel>
              </Disclosure>
            </View>
            <View minWidth="size-4600">
              <SubLabel>Quiet</SubLabel>
              <Disclosure isQuiet>
                <DisclosureTitle>Quiet Disclosure</DisclosureTitle>
                <DisclosurePanel>
                  <p>Quiet variant with reduced visual weight.</p>
                </DisclosurePanel>
              </Disclosure>
            </View>
            <View minWidth="size-4600">
              <SubLabel>Disabled</SubLabel>
              <Disclosure isDisabled>
                <DisclosureTitle>Disabled Section</DisclosureTitle>
                <DisclosurePanel>
                  <p>This disclosure cannot be toggled.</p>
                </DisclosurePanel>
              </Disclosure>
            </View>
          </Flex>
        </View>

        {/* ── Flex ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Flex"
            subtitle="row, column, centered alignment, and wrapping layouts"
          />
          <Flex direction="column" gap="size-300">
            <View>
              <SubLabel>Row (gap size-200)</SubLabel>
              <Flex direction="row" gap="size-200">
                <div style={cellStyle}>Item 1</div>
                <div style={cellStyle}>Item 2</div>
                <div style={cellStyle}>Item 3</div>
              </Flex>
            </View>
            <View>
              <SubLabel>Column (gap size-100)</SubLabel>
              <Flex direction="column" gap="size-100">
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>
                  Row A
                </div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>
                  Row B
                </div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>
                  Row C
                </div>
              </Flex>
            </View>
            <View>
              <SubLabel>Centered (alignItems + justifyContent center)</SubLabel>
              <Flex direction="row" gap="size-200" alignItems="center" justifyContent="center">
                <div
                  style={{
                    ...cellStyle,
                    background: 'var(--spectrum-global-color-magenta-400)',
                    padding: '4px 12px',
                  }}
                >
                  Small
                </div>
                <div
                  style={{
                    ...cellStyle,
                    background: 'var(--spectrum-global-color-magenta-400)',
                    padding: '16px 12px',
                  }}
                >
                  Tall
                </div>
                <div
                  style={{
                    ...cellStyle,
                    background: 'var(--spectrum-global-color-magenta-400)',
                    padding: '4px 12px',
                  }}
                >
                  Small
                </div>
              </Flex>
            </View>
            <View>
              <SubLabel>Wrapping (8 boxes in 400px)</SubLabel>
              <Flex direction="row" gap="size-150" wrap width="size-4600">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    style={{ ...cellStyle, background: 'var(--spectrum-global-color-purple-400)' }}
                  >
                    Box {i + 1}
                  </div>
                ))}
              </Flex>
            </View>
          </Flex>
        </View>

        {/* ── Grid ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Grid"
            subtitle="3-column, 2-column, and centered alignment"
          />
          <Flex direction="column" gap="size-300">
            <View>
              <SubLabel>3 columns (repeat(3, 1fr))</SubLabel>
              <Grid columns="repeat(3, 1fr)" gap="size-200">
                <div style={cellStyle}>Cell 1</div>
                <div style={cellStyle}>Cell 2</div>
                <div style={cellStyle}>Cell 3</div>
                <div style={cellStyle}>Cell 4</div>
                <div style={cellStyle}>Cell 5</div>
                <div style={cellStyle}>Cell 6</div>
              </Grid>
            </View>
            <View>
              <SubLabel>2 columns</SubLabel>
              <Grid columns="repeat(2, 1fr)" gap="size-100">
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>
                  Alpha
                </div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>
                  Beta
                </div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>
                  Gamma
                </div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-green-400)' }}>
                  Delta
                </div>
              </Grid>
            </View>
            <View>
              <SubLabel>Centered items</SubLabel>
              <Grid
                columns="repeat(3, size-1600)"
                gap="size-200"
                justifyItems="center"
                alignItems="center"
              >
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-purple-400)' }}>
                  A
                </div>
                <div
                  style={{
                    ...cellStyle,
                    background: 'var(--spectrum-global-color-purple-400)',
                    padding: '24px',
                  }}
                >
                  B
                </div>
                <div style={{ ...cellStyle, background: 'var(--spectrum-global-color-purple-400)' }}>
                  C
                </div>
              </Grid>
            </View>
          </Flex>
        </View>

        {/* ── Well ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Well"
            subtitle="default, code example, and region role"
          />
          <Flex direction="column" gap="size-200">
            <View>
              <SubLabel>Default</SubLabel>
              <Well>
                This is a standard well. It displays non-editable content separately from other
                content on the screen.
              </Well>
            </View>
            <View>
              <SubLabel>Code example</SubLabel>
              <Well>
                <pre style={{ margin: 0 }}>
                  <code>{`import { Well } from '@geti/ui';\n\n<Well>Content goes here</Well>`}</code>
                </pre>
              </Well>
            </View>
            <View>
              <SubLabel>With region role</SubLabel>
              <Well role="region" aria-label="Notes section">
                This well has an explicit region role for accessibility.
              </Well>
            </View>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
