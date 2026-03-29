import { Badge, Icon } from '@geti-ui/ui';
import { InstallCommand } from '../components/InstallCommand';
import { smartTools } from '../data';

export function SmartToolsShowcaseSection() {
    return (
        <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ui/smart-tools">
            <div className="geti-home-showcase__inner">
                <div className="geti-home-smart-tools-header">
                    <div className="geti-home-showcase__text">
                        <p className="geti-home-showcase__kicker">Annotation tooling</p>
                        <h2 className="geti-home-showcase__title">@geti-ui/smart-tools</h2>
                        <p className="geti-home-showcase__desc">
                            Browser-native computer vision tools for low-latency image annotation. Includes Watershed,
                            GrabCut, Intelligent Scissors, SSIM template matching, and RITM interactive segmentation -
                            powered by OpenCV WASM and ONNX Runtime. Our tools, including Segment Anything, run entirely
                            in the browser with zero server interaction required.
                        </p>
                        <InstallCommand command="npm install @geti-ui/smart-tools" />
                        <div className="geti-home-showcase__meta">
                            <Badge variant="info">7 annotation tools</Badge>
                            <a className="geti-home-showcase__link" href="/smart-tools/installation">
                                Explore smart tools &rarr;
                            </a>
                        </div>
                    </div>
                    <div className="geti-home-smart-tools-logos">
                        <img src="/logos/opencv.svg" alt="OpenCV" className="geti-home-smart-tools-logo" />
                        <img src="/logos/onnx.svg" alt="ONNX Runtime" className="geti-home-smart-tools-logo" />
                        <img src="/logos/webassembly.svg" alt="WebAssembly" className="geti-home-smart-tools-logo" />
                    </div>
                </div>
                <div className="geti-home-showcase__media">
                    <div className="geti-home-smart-tools-grid">
                        {smartTools.map(({ Icon: ToolIcon, name, href }) => (
                            <a key={name} className="geti-home-smart-tools-grid__item" href={href}>
                                <Icon aria-hidden="true">
                                    <ToolIcon width={28} height={28} />
                                </Icon>
                                <span className="geti-home-smart-tools-grid__name">{name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
