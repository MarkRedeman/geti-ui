// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Item, Text } from '@adobe/react-spectrum';

import {
  ActionBar,
  ActionBarContainer,
  CardView,
  Cell,
  Column,
  Divider,
  Flex,
  ListBox,
  ListBoxItem,
  ListItem,
  ListView,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Tag,
  TagGroup,
  TagItem,
  TreeView,
  View,
  VirtualizedHorizontalGrid,
  VirtualizedListLayout,
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

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

interface SampleProject {
  id: number;
  name: string;
  description: string;
}

const sampleProjects: SampleProject[] = [
  { id: 1, name: 'Project Alpha', description: 'Detection · 94% accuracy' },
  { id: 2, name: 'Project Beta', description: 'Classification · 87% accuracy' },
  { id: 3, name: 'Project Gamma', description: 'Segmentation · 91% accuracy' },
  { id: 4, name: 'Project Delta', description: 'Detection · 78% accuracy' },
];

const tableColumns = [
  { name: 'Name', uid: 'name' },
  { name: 'Type', uid: 'type' },
  { name: 'Date Modified', uid: 'date' },
];

const tableRows = [
  { id: 1, name: 'Games', type: 'File folder', date: '6/7/2020' },
  { id: 2, name: 'Program Files', type: 'File folder', date: '4/7/2021' },
  { id: 3, name: 'bootmgr', type: 'System file', date: '11/20/2010' },
  { id: 4, name: 'log.txt', type: 'Text document', date: '1/18/2016' },
];

interface MockGridItem {
  id: string;
  title: string;
}

const gridItems: MockGridItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `item-${i}`,
  title: `Image ${i + 1}`,
}));

interface MockListItem {
  id: string;
  name: string;
  description: string;
}

const listItems: MockListItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: `list-${i}`,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
}));

// ---------------------------------------------------------------------------
// Main example component
// ---------------------------------------------------------------------------

export function DataKitchenSinkExample() {
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
            Data — Kitchen Sink
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--spectrum-global-dimension-font-size-100)',
              color: 'var(--spectrum-global-color-gray-600)',
            }}
          >
            Showcase of all data components: action bar, card view, list box, list view, table view,
            tag, tag group, tree view, and virtualized layouts.
          </p>
        </View>

        <Divider size="L" />

        {/* ── ActionBar ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="ActionBar"
            subtitle="contextual action bar with multi-select list view"
          />
          <ActionBarContainer height="size-2400">
            <ListView
              aria-label="List with Selection"
              selectionMode="multiple"
              defaultSelectedKeys={['1', '2']}
            >
              <ListItem key="1">Item One</ListItem>
              <ListItem key="2">Item Two</ListItem>
              <ListItem key="3">Item Three</ListItem>
            </ListView>
            <ActionBar
              selectedItemCount={2}
              onAction={(key) => console.log('action:', key)}
              onClearSelection={() => console.log('clear')}
            >
              <Item key="edit">
                <Text>Edit</Text>
              </Item>
              <Item key="delete">
                <Text>Delete</Text>
              </Item>
            </ActionBar>
          </ActionBarContainer>
        </View>

        {/* ── CardView ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="CardView"
            subtitle="grid of summary cards with default and selectable states"
          />
          <Flex direction="row" gap="size-400" wrap>
            <View>
              <SubLabel>Default (3 columns)</SubLabel>
              <CardView
                items={sampleProjects}
                aria-label="Project collection"
                columns={3}
                gap="16px"
                renderCard={(item) => ({
                  'aria-label': item.name,
                  children: (
                    <div>
                      <strong>{item.name}</strong>
                      <p style={{ margin: 0, fontSize: '0.8em' }}>{item.description}</p>
                    </div>
                  ),
                })}
              />
            </View>
            <View>
              <SubLabel>Selectable (2 columns)</SubLabel>
              <CardView
                items={sampleProjects.slice(0, 2)}
                aria-label="Select a project"
                columns={2}
                gap="12px"
                renderCard={(item, index) => ({
                  'aria-label': item.name,
                  isSelected: index === 0,
                  onPress: () => {},
                  children: (
                    <div>
                      <strong>{item.name}</strong>
                      <p style={{ margin: 0, fontSize: '0.8em' }}>{item.description}</p>
                    </div>
                  ),
                })}
              />
            </View>
          </Flex>
        </View>

        {/* ── ListBox ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="ListBox"
            subtitle="none, single, and multiple selection modes"
          />
          <Flex direction="row" gap="size-400" wrap alignItems="start">
            <View>
              <SubLabel>No selection</SubLabel>
              <ListBox aria-label="Alignment" width="size-2400">
                <ListBoxItem key="left">Left</ListBoxItem>
                <ListBoxItem key="center">Center</ListBoxItem>
                <ListBoxItem key="right">Right</ListBoxItem>
              </ListBox>
            </View>
            <View>
              <SubLabel>Single selection</SubLabel>
              <ListBox aria-label="Pick a color" selectionMode="single" width="size-2400">
                <ListBoxItem key="red">Red</ListBoxItem>
                <ListBoxItem key="orange">Orange</ListBoxItem>
                <ListBoxItem key="yellow">Yellow</ListBoxItem>
                <ListBoxItem key="green">Green</ListBoxItem>
              </ListBox>
            </View>
            <View>
              <SubLabel>Multiple selection</SubLabel>
              <ListBox aria-label="Select toppings" selectionMode="multiple" width="size-2400">
                <ListBoxItem key="cheese">Cheese</ListBoxItem>
                <ListBoxItem key="mushrooms">Mushrooms</ListBoxItem>
                <ListBoxItem key="olives">Olives</ListBoxItem>
                <ListBoxItem key="peppers">Peppers</ListBoxItem>
              </ListBox>
            </View>
          </Flex>
        </View>

        {/* ── ListView ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="ListView"
            subtitle="single/multi-select and compact/spacious density"
          />
          <Flex direction="row" gap="size-400" wrap alignItems="start">
            <View>
              <SubLabel>Single select</SubLabel>
              <ListView aria-label="Single select" selectionMode="single" width="size-3000">
                <ListItem key="1">Adobe Photoshop</ListItem>
                <ListItem key="2">Adobe XD</ListItem>
                <ListItem key="3">Adobe Illustrator</ListItem>
              </ListView>
            </View>
            <View>
              <SubLabel>Multi select</SubLabel>
              <ListView aria-label="Multi select" selectionMode="multiple" width="size-3000">
                <ListItem key="a">Option One</ListItem>
                <ListItem key="b">Option Two</ListItem>
                <ListItem key="c">Option Three</ListItem>
              </ListView>
            </View>
            <View>
              <SubLabel>Compact</SubLabel>
              <ListView
                aria-label="Compact list"
                density="compact"
                selectionMode="single"
                width="size-3000"
              >
                <ListItem key="x">Compact Item 1</ListItem>
                <ListItem key="y">Compact Item 2</ListItem>
                <ListItem key="z">Compact Item 3</ListItem>
              </ListView>
            </View>
          </Flex>
        </View>

        {/* ── TableView ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="TableView"
            subtitle="default, multi-select, and compact density"
          />
          <Flex direction="column" gap="size-300">
            <View>
              <SubLabel>Default (sortable)</SubLabel>
              <TableView aria-label="Example table" height="size-2400" width="size-6000">
                <TableHeader columns={tableColumns}>
                  {(col) => (
                    <Column key={col.uid} allowsSorting>
                      {col.name}
                    </Column>
                  )}
                </TableHeader>
                <TableBody items={tableRows}>
                  {(item) => (
                    <Row>{(columnKey) => <Cell>{item[columnKey as keyof typeof item]}</Cell>}</Row>
                  )}
                </TableBody>
              </TableView>
            </View>
            <View>
              <SubLabel>Multi-select + compact</SubLabel>
              <TableView
                aria-label="Compact selectable table"
                selectionMode="multiple"
                density="compact"
                height="size-2400"
                width="size-6000"
              >
                <TableHeader columns={tableColumns}>
                  {(col) => <Column key={col.uid}>{col.name}</Column>}
                </TableHeader>
                <TableBody items={tableRows}>
                  {(item) => (
                    <Row>{(columnKey) => <Cell>{item[columnKey as keyof typeof item]}</Cell>}</Row>
                  )}
                </TableBody>
              </TableView>
            </View>
          </Flex>
        </View>

        {/* ── Tag ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="Tag"
            subtitle="dot, no-dot, tooltip, and dark mode variants"
          />
          <Flex direction="row" gap="size-200" wrap alignItems="center">
            <View>
              <SubLabel>Default (with dot)</SubLabel>
              <Tag text="Label" />
            </View>
            <View>
              <SubLabel>No dot</SubLabel>
              <Tag text="No Dot" withDot={false} />
            </View>
            <View>
              <SubLabel>With tooltip</SubLabel>
              <Tag text="Hover me" tooltip="This is a tooltip" />
            </View>
            <View>
              <SubLabel>Dark mode</SubLabel>
              <Tag text="Dark Mode" darkMode />
            </View>
            <View>
              <SubLabel>With prefix</SubLabel>
              <Tag
                text="Prefix"
                prefix={
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      background: 'currentColor',
                      borderRadius: '50%',
                      display: 'inline-block',
                    }}
                  />
                }
              />
            </View>
            <View>
              <SubLabel>With suffix</SubLabel>
              <Tag
                text="Suffix"
                suffix={<span style={{ fontSize: '0.75rem', marginLeft: 4 }}>✕</span>}
              />
            </View>
          </Flex>
        </View>

        {/* ── TagGroup ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="TagGroup"
            subtitle="default, removable, and labelled groups"
          />
          <Flex direction="column" gap="size-200">
            <View>
              <SubLabel>Default</SubLabel>
              <TagGroup aria-label="Categories">
                <TagItem key="news">News</TagItem>
                <TagItem key="travel">Travel</TagItem>
                <TagItem key="gaming">Gaming</TagItem>
                <TagItem key="shopping">Shopping</TagItem>
              </TagGroup>
            </View>
            <View>
              <SubLabel>Removable</SubLabel>
              <TagGroup
                aria-label="Removable tags"
                onRemove={(keys) => console.log('removed:', keys)}
              >
                <TagItem key="chocolate">Chocolate</TagItem>
                <TagItem key="vanilla">Vanilla</TagItem>
                <TagItem key="strawberry">Strawberry</TagItem>
              </TagGroup>
            </View>
            <View>
              <SubLabel>With label</SubLabel>
              <TagGroup label="Departments">
                <TagItem key="design">Design</TagItem>
                <TagItem key="engineering">Engineering</TagItem>
                <TagItem key="marketing">Marketing</TagItem>
              </TagGroup>
            </View>
          </Flex>
        </View>

        {/* ── TreeView ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="TreeView"
            subtitle="hierarchical file-tree structure"
          />
          <TreeView aria-label="Files">
            <Item textValue="Documents">
              <Text>Documents</Text>
              <Item textValue="Project.docx">Project.docx</Item>
              <Item textValue="Budget.xlsx">Budget.xlsx</Item>
            </Item>
            <Item textValue="Images">
              <Text>Images</Text>
              <Item textValue="logo.png">logo.png</Item>
              <Item textValue="banner.jpg">banner.jpg</Item>
            </Item>
            <Item textValue="Videos">
              <Text>Videos</Text>
              <Item textValue="intro.mp4">intro.mp4</Item>
            </Item>
          </TreeView>
        </View>

        {/* ── VirtualizedHorizontalGrid ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="VirtualizedHorizontalGrid"
            subtitle="horizontally scrollable virtualized grid of items"
          />
          <View width="100%" UNSAFE_style={{ maxWidth: '760px' }}>
            <VirtualizedHorizontalGrid
              items={gridItems}
              height="size-2000"
              layoutOptions={{ size: 160, gap: 8 }}
              idFormatter={(item) => item.id}
              textValueFormatter={(item) => item.title}
              renderItem={(item) => (
                <Flex direction="column" gap="size-50" alignItems="center">
                  <View
                    width="size-1600"
                    height="size-1200"
                    backgroundColor="gray-200"
                    borderRadius="regular"
                  />
                  <Text>{item.title}</Text>
                </Flex>
              )}
            />
          </View>
        </View>

        {/* ── VirtualizedListLayout ── */}
        <View padding="size-300" backgroundColor="gray-50" borderRadius="medium">
          <SectionHeading
            title="VirtualizedListLayout"
            subtitle="vertically scrollable virtualized list with loading state"
          />
          <Flex direction="row" gap="size-400" wrap>
            <View width="100%" UNSAFE_style={{ maxWidth: '420px' }}>
              <SubLabel>Default (30 items)</SubLabel>
              <VirtualizedListLayout
                items={listItems}
                ariaLabel="Virtualized list"
                containerHeight="size-3000"
                layoutOptions={{ rowHeight: 52 }}
                idFormatter={(item) => item.id}
                textValueFormatter={(item) => item.name}
                renderItem={(item) => (
                  <Flex
                    direction="column"
                    UNSAFE_style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--spectrum-global-color-gray-200)',
                    }}
                  >
                    <Text>
                      <strong>{item.name}</strong>
                    </Text>
                    <Text>{item.description}</Text>
                  </Flex>
                )}
              />
            </View>
            <View width="100%" UNSAFE_style={{ maxWidth: '420px' }}>
              <SubLabel>Loading state</SubLabel>
              <VirtualizedListLayout
                items={[]}
                ariaLabel="Loading list"
                containerHeight="size-3000"
                layoutOptions={{ rowHeight: 52 }}
                isLoading
                idFormatter={(item: MockListItem) => item.id}
                textValueFormatter={(item: MockListItem) => item.name}
                renderItem={(item: MockListItem) => <Text>{item.name}</Text>}
              />
            </View>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
