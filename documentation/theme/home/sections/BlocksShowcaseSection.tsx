import { MediaGrid, MediaGridThumbnailItem, MediaGridItemStatus, LogsContent } from '@geti-ui/blocks';
import { InstallCommand } from '../components/InstallCommand';
import { TabsDemo } from '../components/TabsDemo';
import { mediaItems, sampleLogs } from '../data';

export function BlocksShowcaseSection() {
    return (
        <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ui/blocks">
            <div className="geti-home-showcase__inner">
                <div className="geti-home-showcase__text">
                    <p className="geti-home-showcase__kicker">Building blocks</p>
                    <h2 className="geti-home-showcase__title">@geti-ui/blocks</h2>
                    <p className="geti-home-showcase__desc">
                        Reusable application-level building blocks composed from <code>@geti-ui/ui</code> primitives.
                        Media grids for dataset browsing, log viewers for training monitoring, and filter systems for
                        data management.
                    </p>
                    <InstallCommand command="npm install @geti-ui/blocks" />
                    <InstallCommand
                        command="npx skills add https://docs.geti-ui.markredeman.nl/.well-known/skills/geti-ui-blocks"
                        variant="subtle"
                        label="Integrate with your favorite AI tools"
                    />
                    <a className="geti-home-showcase__link" href="/blocks/installation">
                        Explore blocks &rarr;
                    </a>
                </div>
                <div className="geti-home-showcase__media geti-home-blocks-demos">
                    <div className="geti-home-demo-panel">
                        {/* Media grid */}
                        <a className="geti-home-demo-heading" href="/blocks/media/media-grid">
                            MediaGrid
                        </a>
                        <div className="geti-home-blocks-media-grid">
                            <MediaGrid
                                totalItems={mediaItems.length}
                                itemSize={125}
                                getItemAt={(i) => mediaItems[i]}
                                renderItem={(ctx) => (
                                    <MediaGridThumbnailItem
                                        isPlaceholder={ctx.isPlaceholder}
                                        isSelected={ctx.isSelected}
                                        onPress={ctx.onPress}
                                        src={ctx.item?.src}
                                        alt={ctx.item?.name}
                                        bottomRight={
                                            ctx.item ? (
                                                <MediaGridItemStatus
                                                    variant={
                                                        ctx.item.status === 'Annotated' ? 'positive' : 'neutral'
                                                    }
                                                >
                                                    {ctx.item.status}
                                                </MediaGridItemStatus>
                                            ) : undefined
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="geti-home-demo-panel">
                        {/* Logs */}
                        <a className="geti-home-demo-heading" href="/blocks/logs">
                            LogsContent
                        </a>
                        <div className="geti-home-blocks-logs">
                            <LogsContent logs={sampleLogs} showFilters={false} />
                        </div>
                    </div>
                </div>

                <div className="geti-home-demo-panel geti-home-demo-panel--full">
                    <a className="geti-home-demo-heading" href="/blocks/tabs/overview">
                        OverflowableTabs + ManagedTab
                    </a>
                    <div className="geti-home-blocks-tabs">
                        <TabsDemo />
                    </div>
                </div>
            </div>
        </section>
    );
}
