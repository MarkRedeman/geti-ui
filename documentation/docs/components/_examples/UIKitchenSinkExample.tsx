import { useState } from 'react';

import { Text } from '@adobe/react-spectrum';

import {
  ActionButton,
  Avatar,
  AvatarGroup,
  Button,
  CornerIndicator,
  Divider,
  Flex,
  Image,
  PhotoPlaceholder,
  PressableElement,
  ToggleButton,
  ToggleButtons,
  View,
} from '@geti/ui';

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

const ToggleButtonsDemo = () => {
  const [selected, setSelected] = useState<string>('grid');
  return (
    <ToggleButtons
      options={['grid', 'list']}
      selectedOption={selected}
      onOptionChange={setSelected}
      getLabel={(option) => {
        if (option === 'grid') return 'Grid';
        return 'List';
      }}
    />
  );
};

const AVATAR_DATA = [
  { src: 'https://i.pravatar.cc/40?img=1', alt: 'Alice Nguyen' },
  { src: 'https://i.pravatar.cc/40?img=2', alt: 'Bob Müller' },
  { src: 'https://i.pravatar.cc/40?img=3', alt: 'Carol Smith' },
  { src: 'https://i.pravatar.cc/40?img=4', alt: 'David Park' },
  { src: 'https://i.pravatar.cc/40?img=5', alt: 'Eva Torres' },
];

export function UIKitchenSinkExample() {
  return (
    <View padding="size-250" width="100%">
      <Flex direction="column" gap="size-300">
        <View>
          <h1
            style={{
              margin: '0 0 4px 0',
              fontSize: 'var(--spectrum-global-dimension-font-size-600)',
              fontWeight: 800,
              color: 'var(--spectrum-global-color-gray-900)',
            }}
          >
            UI — Kitchen Sink
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--spectrum-global-dimension-font-size-100)',
              color: 'var(--spectrum-global-color-gray-600)',
            }}
          >
            Showcase of primitive UI components: buttons, avatars, dividers, images, and utility containers.
          </p>
        </View>

        <Divider size="L" />

        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading title="Button" subtitle="accent, primary, secondary, negative variants; disabled and pending states" />
          <Flex direction="column" gap="size-200">
            <div>
              <SubLabel>Variants</SubLabel>
              <Flex direction="row" gap="size-150" wrap>
                <Button variant="accent">Accent</Button>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="negative">Negative</Button>
              </Flex>
            </div>
            <Divider size="S" />
            <div>
              <SubLabel>States</SubLabel>
              <Flex direction="row" gap="size-150" wrap>
                <Button variant="accent" isDisabled>Disabled</Button>
                <Button variant="accent" isPending>Pending</Button>
              </Flex>
            </div>
          </Flex>
        </View>

        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading title="ActionButton" subtitle="default, dark, light, blue variants; quiet and disabled states" />
          <Flex direction="column" gap="size-200">
            <div>
              <SubLabel>Color variants</SubLabel>
              <Flex direction="row" gap="size-150" wrap>
                <ActionButton>Default</ActionButton>
                <ActionButton colorVariant="dark">Dark</ActionButton>
                <ActionButton colorVariant="light">Light</ActionButton>
                <ActionButton colorVariant="blue">Blue</ActionButton>
              </Flex>
            </div>
            <Divider size="S" />
            <div>
              <SubLabel>States</SubLabel>
              <Flex direction="row" gap="size-150" wrap>
                <ActionButton isQuiet>Quiet</ActionButton>
                <ActionButton isDisabled>Disabled</ActionButton>
                <ActionButton isQuiet isDisabled>Quiet + Disabled</ActionButton>
              </Flex>
            </div>
          </Flex>
        </View>

        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading title="ToggleButton & ToggleButtons" subtitle="single toggles and segmented controls" />
          <Flex direction="column" gap="size-200">
            <Flex direction="row" gap="size-150" wrap>
              <ToggleButton>Unselected</ToggleButton>
              <ToggleButton defaultSelected>Pre-selected</ToggleButton>
              <ToggleButton isEmphasized defaultSelected>Emphasized</ToggleButton>
              <ToggleButton isQuiet>Quiet</ToggleButton>
              <ToggleButton isDisabled>Disabled</ToggleButton>
            </Flex>
            <Divider size="S" />
            <div>
              <SubLabel>Segmented icon options</SubLabel>
              <ToggleButtonsDemo />
            </div>
          </Flex>
        </View>

        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading title="Avatar & AvatarGroup" subtitle="individual avatars and stacked groups" />
          <Flex direction="column" gap="size-200">
            <Flex direction="row" gap="size-200" alignItems="center" wrap>
              <Avatar src="https://i.pravatar.cc/40?img=1" alt="Alice" size="avatar-size-100" />
              <Avatar src="https://i.pravatar.cc/40?img=2" alt="Bob" size="avatar-size-300" />
              <Avatar src="https://i.pravatar.cc/40?img=3" alt="Carol" size="avatar-size-500" />
              <Avatar src="https://i.pravatar.cc/40?img=4" alt="David" size="avatar-size-700" />
            </Flex>
            <Divider size="S" />
            <AvatarGroup avatars={AVATAR_DATA} max={3} />
          </Flex>
        </View>

        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading title="Divider, Image, View, PhotoPlaceholder" subtitle="structural primitives and visual helpers" />
          <Flex direction="column" gap="size-200">
            <Flex direction="column" gap="size-100">
              <Divider size="S" />
              <Divider size="M" />
              <Divider size="L" />
            </Flex>
            <Image
              src="https://picsum.photos/seed/geti-cover/320/160"
              alt="Cover fit"
              width="size-3600"
              height="size-1600"
              objectFit="cover"
              UNSAFE_style={{ borderRadius: 'var(--spectrum-alias-border-radius-medium)' }}
            />
            <View padding="size-200" borderWidth="thin" borderColor="gray-400" borderRadius="medium">
              <Text>Bordered View container</Text>
            </View>
            <Flex direction="row" gap="size-200" wrap>
              <PhotoPlaceholder name="Alice Nguyen" indicator="alice@geti.intel.com" />
              <PhotoPlaceholder name="Bob Müller" indicator="bob@geti.intel.com" />
              <PhotoPlaceholder name="Carol Smith" indicator="carol@geti.intel.com" />
            </Flex>
          </Flex>
        </View>

        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading title="CornerIndicator & PressableElement" subtitle="interaction utility primitives" />
          <Flex direction="row" gap="size-300" wrap alignItems="center">
            <CornerIndicator isActive>
              <View width="size-1200" height="size-1200" backgroundColor="gray-300" borderRadius="medium" UNSAFE_style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text>📁</Text>
              </View>
            </CornerIndicator>
            <CornerIndicator isActive>
              <ActionButton aria-label="Notifications">
                ⇪
              </ActionButton>
            </CornerIndicator>
            <PressableElement onPress={() => {}}>
              <View padding="size-150" backgroundColor="blue-100" borderRadius="medium" UNSAFE_style={{ cursor: 'pointer' }}>
                <Text>Pressable container</Text>
              </View>
            </PressableElement>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
