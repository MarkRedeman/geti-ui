// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  DropZone,
  FileTrigger,
  Flex,
  Form,
  Grid,
  NumberField,
  PasswordField,
  Radio,
  RadioGroup,
  RangeSlider,
  SearchField,
  Slider,
  Switch,
  TextArea,
  TextField,
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
];

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export function FormKitchenSinkExample() {
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
            Form — Kitchen Sink
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--spectrum-global-dimension-font-size-100)',
              color: 'var(--spectrum-global-color-gray-600)',
            }}
          >
            Showcase of all form input components: text fields, toggles, sliders, and file controls.
          </p>
        </View>

        <Divider size="L" />

        {/* ── Text inputs ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Text Inputs"
            subtitle="TextField, TextArea, NumberField, SearchField, PasswordField"
          />
          <Grid columns={['1fr', '1fr']} gap="size-300" UNSAFE_style={{ alignItems: 'start' }}>
            <Flex direction="column" gap="size-250">
              <div>
                <SubLabel>TextField</SubLabel>
                <Flex direction="column" gap="size-150">
                  <TextField label="Username" placeholder="Enter username" width="100%" />
                  <TextField
                    label="Email"
                    placeholder="user@example.com"
                    description="We'll never share your email."
                    width="100%"
                  />
                  <TextField label="Disabled" value="Read-only content" isDisabled width="100%" />
                  <TextField
                    label="Invalid"
                    defaultValue="bad@"
                    validationState="invalid"
                    errorMessage="Enter a valid email address."
                    width="100%"
                  />
                </Flex>
              </div>
              <Divider size="S" />
              <div>
                <SubLabel>TextArea</SubLabel>
                <TextArea label="Description" placeholder="Describe your project…" width="100%" />
              </div>
              <Divider size="S" />
              <div>
                <SubLabel>PasswordField</SubLabel>
                <PasswordField label="Password" placeholder="Enter password" width="100%" />
              </div>
            </Flex>

            <Flex direction="column" gap="size-250">
              <div>
                <SubLabel>NumberField</SubLabel>
                <Flex direction="column" gap="size-150">
                  <NumberField
                    label="Quantity"
                    defaultValue={5}
                    minValue={0}
                    maxValue={100}
                    width="100%"
                  />
                  <NumberField
                    label="Price ($)"
                    defaultValue={9.99}
                    minValue={0}
                    step={0.01}
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                    width="100%"
                  />
                  <NumberField label="Disabled" defaultValue={42} isDisabled width="100%" />
                </Flex>
              </div>
              <Divider size="S" />
              <div>
                <SubLabel>SearchField</SubLabel>
                <SearchField label="Search projects" placeholder="Type to search…" width="100%" />
              </div>
            </Flex>
          </Grid>
        </View>

        {/* ── Selection controls ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Selection Controls"
            subtitle="CheckboxGroup, RadioGroup, Switch"
          />
          <Grid columns={['1fr', '1fr']} gap="size-300" UNSAFE_style={{ alignItems: 'start' }}>
            <Flex direction="column" gap="size-250">
              <div>
                <SubLabel>CheckboxGroup</SubLabel>
                <Flex direction="column" gap="size-150">
                  <CheckboxGroup label="Preferred frameworks" defaultValue={['react', 'svelte']}>
                    {FRAMEWORK_OPTIONS.map(({ key, label }) => (
                      <Checkbox key={key} value={key}>
                        {label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                  <CheckboxGroup label="Horizontal" orientation="horizontal">
                    <Checkbox value="a">Option A</Checkbox>
                    <Checkbox value="b">Option B</Checkbox>
                    <Checkbox value="c">Option C</Checkbox>
                  </CheckboxGroup>
                  <CheckboxGroup label="Disabled group" isDisabled>
                    <Checkbox value="x">Option X</Checkbox>
                    <Checkbox value="y">Option Y</Checkbox>
                  </CheckboxGroup>
                </Flex>
              </div>
            </Flex>

            <Flex direction="column" gap="size-250">
              <div>
                <SubLabel>RadioGroup</SubLabel>
                <Flex direction="column" gap="size-150">
                  <RadioGroup label="Deployment target" defaultValue="cloud">
                    <Radio value="cloud">Cloud</Radio>
                    <Radio value="on-prem">On-premises</Radio>
                    <Radio value="edge">Edge device</Radio>
                  </RadioGroup>
                  <RadioGroup label="Alignment (horizontal)" orientation="horizontal">
                    <Radio value="left">Left</Radio>
                    <Radio value="center">Center</Radio>
                    <Radio value="right">Right</Radio>
                  </RadioGroup>
                </Flex>
              </div>
              <Divider size="S" />
              <div>
                <SubLabel>Switch</SubLabel>
                <Flex direction="column" gap="size-100">
                  <Switch>Dark mode</Switch>
                  <Switch defaultSelected>Notifications (on)</Switch>
                  <Switch isDisabled>Disabled option</Switch>
                </Flex>
              </div>
            </Flex>
          </Grid>
        </View>

        {/* ── Sliders ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Sliders"
            subtitle="Slider (single handle) and RangeSlider (dual handle)"
          />
          <Flex direction="column" gap="size-200">
            <div>
              <SubLabel>Slider</SubLabel>
              <Flex direction="column" gap="size-150">
                <Slider
                  label="Opacity"
                  defaultValue={60}
                  minValue={0}
                  maxValue={100}
                  isFilled
                  width="100%"
                />
                <Slider
                  label="Volume"
                  defaultValue={30}
                  minValue={0}
                  maxValue={100}
                  step={10}
                  width="100%"
                />
                <Slider label="Disabled" defaultValue={50} isDisabled width="100%" />
              </Flex>
            </div>
            <Divider size="S" />
            <div>
              <SubLabel>RangeSlider</SubLabel>
              <Flex direction="column" gap="size-150">
                <RangeSlider
                  label="Confidence threshold"
                  defaultValue={{ start: 20, end: 80 }}
                  minValue={0}
                  maxValue={100}
                  width="100%"
                />
                <RangeSlider
                  label="Disabled range"
                  defaultValue={{ start: 30, end: 70 }}
                  isDisabled
                  width="100%"
                />
              </Flex>
            </div>
          </Flex>
        </View>

        {/* ── File controls ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="File Controls"
            subtitle="FileTrigger (button wrapper) and DropZone (drag-and-drop target)"
          />
          <Flex direction="column" gap="size-250">
            <div>
              <SubLabel>FileTrigger</SubLabel>
              <Flex direction="row" gap="size-150" wrap>
                <FileTrigger>
                  <Button variant="accent">Upload file</Button>
                </FileTrigger>
                <FileTrigger acceptedFileTypes={['image/*']}>
                  <Button variant="secondary">Images only</Button>
                </FileTrigger>
                <FileTrigger allowsMultiple>
                  <Button variant="secondary">Multiple files</Button>
                </FileTrigger>
              </Flex>
            </div>
            <Divider size="S" />
            <div>
              <SubLabel>DropZone</SubLabel>
              <Flex direction="row" gap="size-300" wrap alignItems="start">
                <DropZone>
                  <Flex
                    direction="column"
                    gap="size-100"
                    alignItems="center"
                    UNSAFE_style={{ padding: '24px 32px' }}
                  >
                    <span
                      style={{ fontSize: 'var(--spectrum-global-dimension-font-size-75)' }}
                    >
                      Drop files here or
                    </span>
                    <FileTrigger>
                      <Button variant="secondary">Browse files</Button>
                    </FileTrigger>
                  </Flex>
                </DropZone>
                <DropZone isFilled>
                  <Flex
                    direction="column"
                    gap="size-100"
                    alignItems="center"
                    UNSAFE_style={{ padding: '24px 32px' }}
                  >
                    <span
                      style={{ fontSize: 'var(--spectrum-global-dimension-font-size-75)' }}
                    >
                      Filled state
                    </span>
                  </Flex>
                </DropZone>
              </Flex>
            </div>
          </Flex>
        </View>

        {/* ── Form wrapper ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Form"
            subtitle="Form wrapper with labelled inputs and submit/reset actions"
          />
          <Form aria-label="Sample form" maxWidth="size-4600">
            <TextField label="Full name" placeholder="Jane Doe" isRequired />
            <TextField label="Email" placeholder="jane@example.com" type="email" isRequired />
            <NumberField label="Age" minValue={18} maxValue={120} />
            <Switch>Subscribe to newsletter</Switch>
            <Flex direction="row" gap="size-150">
              <Button variant="accent" type="submit">
                Submit
              </Button>
              <Button variant="secondary" type="reset">
                Reset
              </Button>
            </Flex>
          </Form>
        </View>
      </Flex>
    </View>
  );
}
