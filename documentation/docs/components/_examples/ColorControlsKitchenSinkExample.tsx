// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import {
  ColorArea,
  ColorField,
  ColorPickerDialog,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorWheel,
  ComboBox,
  ComboBoxItem,
  Divider,
  Flex,
  Grid,
  Picker,
  PickerItem,
  View,
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

const FRAMEWORK_OPTIONS = [
  { key: 'react', label: 'React' },
  { key: 'vue', label: 'Vue' },
  { key: 'angular', label: 'Angular' },
  { key: 'svelte', label: 'Svelte' },
  { key: 'solid', label: 'Solid' },
];

const ANIMAL_OPTIONS = [
  { key: 'cat', label: 'Cat' },
  { key: 'dog', label: 'Dog' },
  { key: 'red-panda', label: 'Red Panda' },
  { key: 'axolotl', label: 'Axolotl' },
  { key: 'capybara', label: 'Capybara' },
];

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export function ColorControlsKitchenSinkExample() {
  return (
    <View padding="size-250" width="100%">
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
            Color Controls &amp; Pickers — Kitchen Sink
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--spectrum-global-dimension-font-size-100)',
              color: 'var(--spectrum-global-color-gray-600)',
            }}
          >
            Showcase of color picker components and dropdown/autocomplete selection:
            ColorArea, ColorSlider, ColorWheel, ColorField, ColorSwatchPicker,
            ColorPickerDialog, ColorSwatch, Picker, and ComboBox.
          </p>
        </View>

        <Divider size="L" />

        {/* ── Picker & ComboBox ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Picker &amp; ComboBox"
            subtitle="Dropdown and autocomplete selection components"
          />
          <Grid columns={['1fr', '1fr']} gap="size-300" UNSAFE_style={{ alignItems: 'start' }}>
            <Flex direction="column" gap="size-200">
              <div>
                <SubLabel>Picker</SubLabel>
                <Flex direction="column" gap="size-150">
                  <Picker label="Framework" defaultSelectedKey="react" width="100%">
                    {FRAMEWORK_OPTIONS.map(({ key, label }) => (
                      <PickerItem key={key}>{label}</PickerItem>
                    ))}
                  </Picker>
                  <Picker label="Disabled picker" isDisabled width="100%">
                    {FRAMEWORK_OPTIONS.map(({ key, label }) => (
                      <PickerItem key={key}>{label}</PickerItem>
                    ))}
                  </Picker>
                  <Picker
                    label="Invalid picker"
                    validationState="invalid"
                    errorMessage="Selection required."
                    width="100%"
                  >
                    {FRAMEWORK_OPTIONS.map(({ key, label }) => (
                      <PickerItem key={key}>{label}</PickerItem>
                    ))}
                  </Picker>
                </Flex>
              </div>
            </Flex>

            <Flex direction="column" gap="size-200">
              <div>
                <SubLabel>ComboBox</SubLabel>
                <Flex direction="column" gap="size-150">
                  <ComboBox label="Favorite animal" defaultSelectedKey="cat" width="100%">
                    {ANIMAL_OPTIONS.map(({ key, label }) => (
                      <ComboBoxItem key={key}>{label}</ComboBoxItem>
                    ))}
                  </ComboBox>
                  <ComboBox label="Search animals" defaultInputValue="Cap" width="100%">
                    {ANIMAL_OPTIONS.map(({ key, label }) => (
                      <ComboBoxItem key={key}>{label}</ComboBoxItem>
                    ))}
                  </ComboBox>
                  <ComboBox label="Disabled" isDisabled width="100%">
                    {ANIMAL_OPTIONS.map(({ key, label }) => (
                      <ComboBoxItem key={key}>{label}</ComboBoxItem>
                    ))}
                  </ComboBox>
                </Flex>
              </div>
            </Flex>
          </Grid>
        </View>

        {/* ── Color controls ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Color Controls"
            subtitle="ColorArea, ColorSlider, ColorWheel, ColorField, ColorSwatchPicker, ColorPickerDialog, ColorSwatch"
          />

          <Flex direction="column" gap="size-300">
            {/* ColorArea */}
            <div>
              <SubLabel>ColorArea — 2-D saturation/brightness</SubLabel>
              <ColorArea
                defaultValue="hsb(220, 80%, 90%)"
                xChannel="saturation"
                yChannel="brightness"
              />
            </div>

            <Divider size="S" />

            {/* ColorSlider */}
            <div>
              <SubLabel>ColorSlider — single-channel sliders</SubLabel>
              <Flex direction="column" gap="size-150">
                <ColorSlider defaultValue="hsl(0, 100%, 50%)" channel="hue" label="Hue" />
                <ColorSlider
                  defaultValue="hsla(220, 100%, 50%, 0.5)"
                  channel="alpha"
                  label="Alpha"
                />
                <ColorSlider defaultValue="#c04000" channel="red" label="Red channel" />
              </Flex>
            </div>

            <Divider size="S" />

            {/* ColorWheel */}
            <div>
              <SubLabel>ColorWheel — circular hue picker</SubLabel>
              <Flex direction="row" gap="size-300" alignItems="center">
                <ColorWheel defaultValue="hsl(220, 100%, 50%)" />
                <ColorWheel defaultValue="hsl(0, 80%, 50%)" isDisabled />
              </Flex>
            </div>

            <Divider size="S" />

            {/* ColorField */}
            <div>
              <SubLabel>ColorField — hex input</SubLabel>
              <Flex direction="column" gap="size-150">
                <ColorField label="Brand color" defaultValue="#0071e3" width="size-2400" />
                <ColorField
                  label="Invalid"
                  defaultValue="#xyz"
                  validationState="invalid"
                  errorMessage="Enter a valid hex color."
                  width="size-2400"
                />
                <ColorField label="Disabled" defaultValue="#888888" isDisabled width="size-2400" />
              </Flex>
            </div>

            <Divider size="S" />

            {/* ColorSwatchPicker */}
            <div>
              <SubLabel>ColorSwatchPicker — preset swatches</SubLabel>
              <ColorSwatchPicker aria-label="Label colors" defaultValue="#ff0000">
                <ColorSwatchPickerItem color="#ff0000" aria-label="Red" />
                <ColorSwatchPickerItem color="#ff8800" aria-label="Orange" />
                <ColorSwatchPickerItem color="#ffee00" aria-label="Yellow" />
                <ColorSwatchPickerItem color="#00cc44" aria-label="Green" />
                <ColorSwatchPickerItem color="#0071e3" aria-label="Blue" />
                <ColorSwatchPickerItem color="#9b30ff" aria-label="Purple" />
                <ColorSwatchPickerItem color="#ff2d78" aria-label="Pink" />
                <ColorSwatchPickerItem color="#888888" aria-label="Grey" />
              </ColorSwatchPicker>
            </div>

            <Divider size="S" />

            {/* ColorPickerDialog */}
            <div>
              <SubLabel>ColorPickerDialog — full picker in a dialog</SubLabel>
              <Flex direction="row" gap="size-200" wrap>
                <ColorPickerDialog label="Pick annotation color" color="#0071e3" />
                <ColorPickerDialog label="Background fill" color="#00cc44" />
              </Flex>
            </div>

            <Divider size="S" />

            {/* ColorSwatch */}
            <div>
              <SubLabel>ColorSwatch — inline at multiple sizes</SubLabel>
              <Flex direction="row" gap="size-150" alignItems="center" wrap>
                <ColorSwatch color="#ff0000" size="XS" aria-label="Red XS" />
                <ColorSwatch color="#ff8800" size="S" aria-label="Orange S" />
                <ColorSwatch color="#0071e3" size="M" aria-label="Blue M" />
                <ColorSwatch color="#9b30ff" size="L" aria-label="Purple L" />
                <ColorSwatch color="#00cc44" rounding="full" size="M" aria-label="Green round" />
                <ColorSwatch color="#888888" rounding="none" size="M" aria-label="Grey square" />
              </Flex>
            </div>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
