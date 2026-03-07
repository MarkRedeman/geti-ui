// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import type { Meta, StoryObj } from '@storybook/react';

import { Calendar, RangeCalendar } from './Calendar/Calendar';
import { ColorArea } from './ColorArea/ColorArea';
import { ColorField } from './ColorField/ColorField';
import { ColorPickerDialog } from './ColorPickerDialog/ColorPickerDialog';
import { ColorSlider } from './ColorSlider/ColorSlider';
import { ColorSwatch } from './color-swatch/ColorSwatch';
import { ColorSwatchPicker, ColorSwatchPickerItem } from './color-swatch/ColorSwatchPicker';
import { ColorWheel } from './ColorWheel/ColorWheel';
import { ComboBox, Item as ComboBoxItem } from './ComboBox/ComboBox';
import { DateField, TimeField } from './DateField/DateField';
import { DatePicker } from './DatePicker/DatePicker';
import { DateRangePicker } from './DateRangePicker/DateRangePicker';
import { Item as PickerItem, Picker } from './Picker/Picker';
import { Divider } from '../../ui/Divider/Divider';
import { Flex } from '../../layouts/Flex/Flex';
import { Grid } from '../../layouts/Grid/Grid';
import { View } from '../../ui/View/View';

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
// Kitchen Sink component
// ---------------------------------------------------------------------------

const PickersKitchenSink = () => (
    <View padding="size-400">
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
                    Form/Pickers — Kitchen Sink
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: 'var(--spectrum-global-dimension-font-size-100)',
                        color: 'var(--spectrum-global-color-gray-600)',
                    }}
                >
                    Showcase of all picker components: color pickers, date/time pickers, Picker and ComboBox.
                </p>
            </View>

            <Divider size="L" />

            {/* ── Picker & ComboBox ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Picker & ComboBox" subtitle="dropdown and autocomplete selection components" />
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
                                <Picker label="Invalid picker" validationState="invalid" errorMessage="Selection required." width="100%">
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

            {/* ── Color pickers ── */}
            <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
                <SectionHeading title="Color Pickers" subtitle="ColorArea, ColorSlider, ColorWheel, ColorField, ColorSwatchPicker, ColorPickerDialog, ColorSwatch" />
                <Grid columns={['1fr', '1fr']} gap="size-400" UNSAFE_style={{ alignItems: 'start' }}>
                    <Flex direction="column" gap="size-300">
                        <div>
                            <SubLabel>ColorArea — 2-D saturation/brightness</SubLabel>
                            <ColorArea defaultValue="hsb(220, 80%, 90%)" xChannel="saturation" yChannel="brightness" />
                        </div>
                        <Divider size="S" />
                        <div>
                            <SubLabel>ColorSlider — single-channel sliders</SubLabel>
                            <Flex direction="column" gap="size-150">
                                <ColorSlider defaultValue="hsl(0, 100%, 50%)" channel="hue" label="Hue" />
                                <ColorSlider defaultValue="hsla(220, 100%, 50%, 0.5)" channel="alpha" label="Alpha" />
                                <ColorSlider defaultValue="#c04000" channel="red" label="Red channel" />
                            </Flex>
                        </div>
                        <Divider size="S" />
                        <div>
                            <SubLabel>ColorWheel — circular hue picker</SubLabel>
                            <Flex direction="row" gap="size-300" alignItems="center">
                                <ColorWheel defaultValue="hsl(220, 100%, 50%)" />
                                <ColorWheel defaultValue="hsl(0, 80%, 50%)" isDisabled />
                            </Flex>
                        </div>
                        <Divider size="S" />
                        <div>
                            <SubLabel>ColorField — hex input</SubLabel>
                            <Flex direction="column" gap="size-150">
                                <ColorField label="Brand color" defaultValue="#0071e3" width="size-2400" />
                                <ColorField label="Invalid" defaultValue="#xyz" validationState="invalid" errorMessage="Enter a valid hex color." width="size-2400" />
                                <ColorField label="Disabled" defaultValue="#888888" isDisabled width="size-2400" />
                            </Flex>
                        </div>
                        <Divider size="S" />
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
                        <div>
                            <SubLabel>ColorPickerDialog — full picker in a dialog</SubLabel>
                            <Flex direction="row" gap="size-200" wrap>
                                <ColorPickerDialog label="Pick annotation color" color="#0071e3" />
                                <ColorPickerDialog label="Background fill" color="#00cc44" />
                            </Flex>
                        </div>
                        <Divider size="S" />
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

                    {/* ── Date & Time pickers ── */}
                    <Flex direction="column" gap="size-300">
                        <div>
                            <SubLabel>DateField — keyboard date entry</SubLabel>
                            <Flex direction="column" gap="size-150">
                                <DateField label="Start date" width="size-2400" />
                                <DateField label="With time" granularity="minute" width="size-2400" />
                                <DateField label="Invalid" validationState="invalid" errorMessage="Please enter a valid date." width="size-2400" />
                                <DateField label="Disabled" isDisabled width="size-2400" />
                            </Flex>
                        </div>
                        <Divider size="S" />
                        <div>
                            <SubLabel>TimeField — keyboard time entry</SubLabel>
                            <Flex direction="column" gap="size-150">
                                <TimeField label="Start time" width="size-2400" />
                                <TimeField label="With seconds" granularity="second" width="size-2400" />
                                <TimeField label="Disabled" isDisabled width="size-2400" />
                            </Flex>
                        </div>
                        <Divider size="S" />
                        <div>
                            <SubLabel>DatePicker — calendar popover</SubLabel>
                            <Flex direction="column" gap="size-150">
                                <DatePicker label="Event date" />
                                <DatePicker label="With time" granularity="minute" />
                                <DatePicker label="Disabled" isDisabled />
                            </Flex>
                        </div>
                        <Divider size="S" />
                        <div>
                            <SubLabel>DateRangePicker — start &amp; end range</SubLabel>
                            <Flex direction="column" gap="size-150">
                                <DateRangePicker label="Training window" />
                                <DateRangePicker label="Disabled range" isDisabled />
                            </Flex>
                        </div>
                        <Divider size="S" />
                        <div>
                            <SubLabel>Calendar — inline single-date picker</SubLabel>
                            <Flex direction="row" gap="size-400" wrap alignItems="start">
                                <Flex direction="column" gap="size-75" alignItems="center">
                                    <Calendar aria-label="Select annotation date" />
                                    <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>Default</span>
                                </Flex>
                                <Flex direction="column" gap="size-75" alignItems="center">
                                    <Calendar aria-label="Disabled calendar" isDisabled />
                                    <span style={{ fontSize: 'var(--spectrum-global-dimension-font-size-50)', color: 'var(--spectrum-global-color-gray-600)' }}>Disabled</span>
                                </Flex>
                            </Flex>
                        </div>
                        <Divider size="S" />
                        <div>
                            <SubLabel>RangeCalendar — inline date-range picker</SubLabel>
                            <RangeCalendar aria-label="Select data export range" />
                        </div>
                    </Flex>
                </Grid>
            </View>
        </Flex>
    </View>
);

// ---------------------------------------------------------------------------
// Storybook meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof PickersKitchenSink> = {
    component: PickersKitchenSink,
    title: 'Form/Pickers/Kitchen Sink',
    parameters: {
        a11y: {},
        layout: 'fullscreen',
    },
};
export default meta;

type Story = StoryObj<typeof PickersKitchenSink>;

export const Default: Story = {};
