import {
    LineChart,
    BarChart,
    DonutChart,
    Sparkline,
    ChartsThemeProvider,
    getDatasetSubsetColor,
    ConfusionMatrixChart,
    ParallelCoordinates,
} from '@geti-ui/charts';
import { View } from '@geti-ui/ui';
import { InstallCommand } from '../components/InstallCommand';
import {
    trainingTrend,
    classMetrics,
    sparkAccuracy,
    sparkLoss,
    sparkF1,
    sparkLR,
    sparkPrecision,
    sparkMAP,
    classDistribution,
    confusionLabels,
    confusionMatrix,
    parallelData,
} from '../data';

export function ChartsShowcaseSection() {
    return (
        <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ui/charts">
            <div className="geti-home-showcase__inner">
                <div className="geti-home-showcase__text">
                    <p className="geti-home-showcase__kicker">Charts</p>
                    <h2 className="geti-home-showcase__title">@geti-ui/charts</h2>
                    <p className="geti-home-showcase__desc">
                        Recharts-based primitives and ML-focused compositions. Standard charts for dashboards, plus
                        specialized visualizations for training metrics, confusion matrices, precision-recall curves,
                        and more.
                    </p>
                    <InstallCommand command="npm install @geti-ui/charts" />
                    <InstallCommand
                        command="npx skills add https://docs.geti-ui.markredeman.nl/.well-known/skills/geti-ui-charts"
                        variant="subtle"
                        label="Integrate with your favorite AI tools"
                    />
                    <a className="geti-home-showcase__link" href="/charts/compositions">
                        See all chart compositions &rarr;
                    </a>
                </div>
                <div className="geti-home-showcase__media">
                    <ChartsThemeProvider>
                        {/* Sparklines - full-width row on top */}
                        <div className="geti-home-demo-panel">
                            <div className="geti-home-sparkline-row">
                                <div className="geti-home-sparkline-item">
                                    <span className="geti-home-sparkline-label">Loss</span>
                                    <Sparkline
                                        data={sparkLoss}
                                        dataKey="v"
                                        height={32}
                                        width={120}
                                        color="#ff5662"
                                        area
                                        fillOpacity={0.18}
                                    />
                                </div>
                                <div className="geti-home-sparkline-item">
                                    <span className="geti-home-sparkline-label">Accuracy</span>
                                    <Sparkline
                                        data={sparkAccuracy}
                                        dataKey="v"
                                        height={32}
                                        width={120}
                                        color="#6ee7d8"
                                    />
                                </div>
                                <div className="geti-home-sparkline-item">
                                    <span className="geti-home-sparkline-label">F1</span>
                                    <Sparkline
                                        data={sparkF1}
                                        dataKey="v"
                                        height={32}
                                        width={120}
                                        color="#3fd0ff"
                                        area
                                        fillOpacity={0.15}
                                    />
                                </div>
                                <div className="geti-home-sparkline-item">
                                    <span className="geti-home-sparkline-label">LR</span>
                                    <Sparkline
                                        data={sparkLR}
                                        dataKey="v"
                                        height={32}
                                        width={120}
                                        color="#fec91b"
                                    />
                                </div>
                                <div className="geti-home-sparkline-item">
                                    <span className="geti-home-sparkline-label">Precision</span>
                                    <Sparkline
                                        data={sparkPrecision}
                                        dataKey="v"
                                        height={32}
                                        width={120}
                                        color="#8bae46"
                                        area
                                        fillOpacity={0.15}
                                    />
                                </div>
                                <div className="geti-home-sparkline-item">
                                    <span className="geti-home-sparkline-label">mAP</span>
                                    <Sparkline
                                        data={sparkMAP}
                                        dataKey="v"
                                        height={32}
                                        width={120}
                                        color="#8f5da2"
                                        area
                                        fillOpacity={0.2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Chart compositions ── */}
                        <View marginTop="size-200">
                            <a className="geti-home-demo-heading" href="/charts/compositions">
                                Chart compositions
                            </a>
                        </View>
                        <div className="geti-home-charts-demos">
                            <div className="geti-home-demo-panel">
                                <LineChart
                                    data={trainingTrend}
                                    xAxisKey="step"
                                    yScale={{ domain: [0, 1] }}
                                    series={[
                                        {
                                            dataKey: 'train',
                                            name: 'Train',
                                            color: getDatasetSubsetColor('train'),
                                        },
                                        {
                                            dataKey: 'val',
                                            name: 'Validation',
                                            color: getDatasetSubsetColor('validation'),
                                            dashed: true,
                                        },
                                        {
                                            dataKey: 'test',
                                            name: 'Test',
                                            color: getDatasetSubsetColor('test'),
                                            dashed: true,
                                        },
                                    ]}
                                    showLegend
                                    aria-label="Model quality trend"
                                    height={200}
                                />
                            </div>
                            <div className="geti-home-demo-panel">
                                <BarChart
                                    data={classMetrics}
                                    xAxisKey="class"
                                    series={[
                                        { dataKey: 'precision', name: 'Precision', color: '#3fd0ff' },
                                        { dataKey: 'recall', name: 'Recall', color: '#6ee7d8' },
                                        { dataKey: 'f1', name: 'F1 Score', color: '#8bae46' },
                                    ]}
                                    yScale={{ domain: [0, 1] }}
                                    height={200}
                                    showLegend
                                    aria-label="Per-class metrics"
                                />
                            </div>
                            <div className="geti-home-demo-panel">
                                <DonutChart
                                    data={classDistribution}
                                    valueKey="count"
                                    nameKey="name"
                                    height={200}
                                    showLegend
                                    aria-label="Class distribution"
                                />
                            </div>
                        </div>

                        {/* ── Machine learning charts ── */}
                        <View marginTop="size-200">
                            <a className="geti-home-demo-heading" href="/charts/compositions">
                                Machine learning charts
                            </a>
                        </View>
                        <div className="geti-home-charts-ml-demos">
                            <div className="geti-home-demo-panel">
                                <ConfusionMatrixChart
                                    matrix={confusionMatrix}
                                    labels={confusionLabels}
                                    height={280}
                                    aria-label="Confusion matrix"
                                />
                            </div>
                            <div className="geti-home-demo-panel">
                                <ParallelCoordinates
                                    data={parallelData}
                                    axes={[
                                        { dataKey: 'lr', label: 'Learning Rate' },
                                        { dataKey: 'batchSize', label: 'Batch Size' },
                                        { dataKey: 'epochs', label: 'Epochs' },
                                        { dataKey: 'dropout', label: 'Dropout' },
                                        { dataKey: 'mAP', label: 'mAP' },
                                    ]}
                                    colorBy="right"
                                    height={280}
                                    highlight={{ enabled: true, interaction: { lineHover: true } }}
                                    lineOpacity={0.6}
                                    strokeWidth={2.0}
                                    aria-label="Hyperparameter parallel coordinates"
                                />
                            </div>
                        </div>
                    </ChartsThemeProvider>
                </div>
            </div>
        </section>
    );
}
