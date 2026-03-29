import {
    Button,
    TextField,
    Picker,
    PickerItem,
    Switch,
    Checkbox,
    Slider,
    Badge,
    StatusLight,
    ProgressBar,
    TagGroup,
    TagItem,
    ActionButton,
    View,
    Text,
    Divider,
    Flex,
    ButtonGroup,
    TableView,
    TableHeader,
    TableBody,
    Column,
    Row,
    Cell,
    Icon,
} from '@geti-ui/ui';
import { ChevronLeft, ChevronRight } from '@geti-ui/ui/icons';
import { InstallCommand } from '../components/InstallCommand';

export function UiShowcaseSection() {
    return (
        <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ui/ui">
            <div className="geti-home-showcase__inner">
                <div className="geti-home-showcase__text">
                    <p className="geti-home-showcase__kicker">Core UI</p>
                    <h2 className="geti-home-showcase__title">@geti-ui/ui</h2>
                    <p className="geti-home-showcase__desc">
                        Accessible, themeable React components for interactive AI workflows. 90+ components built on
                        Adobe React Spectrum and react-aria-components, with dark-mode-first styling.
                    </p>
                    <InstallCommand command="npm install @geti-ui/ui" />
                    <InstallCommand
                        command="npx skills add https://docs.geti-ui.markredeman.nl/.well-known/skills/geti-ui"
                        variant="subtle"
                        label="Integrate with your favorite AI tools"
                    />
                    <a className="geti-home-showcase__link" href="/components/ui/Button">
                        Explore 90+ components &rarr;
                    </a>
                </div>
                <div className="geti-home-showcase__media geti-home-ui-demos">
                    {/* ── Toolbar (full width) ── */}
                    <div className="geti-home-demo-panel geti-home-demo-panel--full geti-home-ui-toolbar">
                        <Flex justifyContent="space-between" width="100%">
                            <Flex alignItems="center" gap="size-200">
                                <Picker
                                    label="Active model"
                                    labelPosition="side"
                                    defaultSelectedKey="sam"
                                    isQuiet
                                    aria-label="Model"
                                    width="size-2000"
                                >
                                    <PickerItem key="sam">LVM: SAM</PickerItem>
                                    <PickerItem key="yolo">YOLO v8</PickerItem>
                                </Picker>
                                <Divider orientation="vertical" size="S" />
                                <Switch>Explanation</Switch>
                                <Switch defaultSelected>Annotations</Switch>
                                <Picker defaultSelectedKey="hearts" isQuiet aria-label="Suit">
                                    <PickerItem key="hearts">Hearts</PickerItem>
                                    <PickerItem key="diamonds">Diamonds</PickerItem>
                                    <PickerItem key="spades">Spades</PickerItem>
                                    <PickerItem key="clubs">Clubs</PickerItem>
                                </Picker>
                            </Flex>
                            <Flex gap="size-200">
                                <Flex gap="size-50">
                                    <ActionButton isQuiet aria-label="Previous">
                                        <Icon>
                                            <ChevronLeft />
                                        </Icon>
                                    </ActionButton>
                                    <ActionButton isQuiet aria-label="Next">
                                        <Icon>
                                            <ChevronRight />
                                        </Icon>
                                    </ActionButton>
                                </Flex>
                                <Divider orientation="vertical" size="S" />
                                <Button variant="accent">Submit</Button>
                            </Flex>
                        </Flex>
                    </div>

                    {/* ── Run test dialog ── */}
                    <div className="geti-home-demo-panel geti-home-ui-form">
                        <span className="geti-home-demo-panel__heading">Run test</span>
                        <TextField label="Test name" defaultValue="Nightly regression" width="100%" />
                        <div className="geti-home-demo-row geti-home-demo-row--form">
                            <Picker label="Model" defaultSelectedKey="yolo" width="100%">
                                <PickerItem key="yolo">YOLO v8</PickerItem>
                                <PickerItem key="ssd">SSD MobileNet</PickerItem>
                                <PickerItem key="atss">ATSS</PickerItem>
                            </Picker>
                            <Picker label="Version" defaultSelectedKey="v3" width="100%">
                                <PickerItem key="v1">v1.0</PickerItem>
                                <PickerItem key="v2">v2.0</PickerItem>
                                <PickerItem key="v3">v3.0</PickerItem>
                            </Picker>
                        </div>
                        <Picker label="Optimization" defaultSelectedKey="fp16" width="100%">
                            <PickerItem key="fp16">OpenVINO FP16</PickerItem>
                            <PickerItem key="fp32">OpenVINO FP32</PickerItem>
                            <PickerItem key="int8">OpenVINO Int8</PickerItem>
                        </Picker>
                        <Picker label="Dataset" defaultSelectedKey="val" width="100%">
                            <PickerItem key="train">Training set</PickerItem>
                            <PickerItem key="val">Validation set</PickerItem>
                            <PickerItem key="test">Testing set</PickerItem>
                        </Picker>
                        <ButtonGroup align="end">
                            <Button variant="secondary">Cancel</Button>
                            <Button variant="accent">Run test</Button>
                        </ButtonGroup>
                    </div>

                    {/* ── Test results table ── */}
                    <div className="geti-home-demo-panel">
                        <span className="geti-home-demo-panel__heading">Test results</span>
                        <div className="geti-home-demo-row">
                            <Badge variant="positive">3 passed</Badge>
                            <Badge variant="negative">1 failed</Badge>
                            <StatusLight variant="positive">Deployed</StatusLight>
                            <StatusLight variant="notice">Queued</StatusLight>
                        </div>
                        <ProgressBar label="Test progress" value={75} />
                        <TableView aria-label="Recent test runs" overflowMode="truncate">
                            <TableHeader>
                                <Column key="name" isRowHeader>
                                    Test name
                                </Column>
                                <Column key="model">Model</Column>
                                <Column key="score">Score</Column>
                                <Column key="status">Status</Column>
                            </TableHeader>
                            <TableBody>
                                <Row key="1">
                                    <Cell>Nightly regression</Cell>
                                    <Cell>YOLO v8</Cell>
                                    <Cell>0.92</Cell>
                                    <Cell>Passed</Cell>
                                </Row>
                                <Row key="2">
                                    <Cell>Edge cases</Cell>
                                    <Cell>SSD MobileNet</Cell>
                                    <Cell>0.78</Cell>
                                    <Cell>Failed</Cell>
                                </Row>
                                <Row key="3">
                                    <Cell>Drift detection</Cell>
                                    <Cell>ATSS</Cell>
                                    <Cell>0.88</Cell>
                                    <Cell>Passed</Cell>
                                </Row>
                            </TableBody>
                        </TableView>
                        <TagGroup aria-label="Labels">
                            <TagItem key="car">Car</TagItem>
                            <TagItem key="person">Person</TagItem>
                            <TagItem key="bike">Bike</TagItem>
                            <TagItem key="truck">Truck</TagItem>
                        </TagGroup>
                    </div>
                </div>
            </div>
        </section>
    );
}
