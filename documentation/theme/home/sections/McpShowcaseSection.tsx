import { Badge } from '@geti-ui/ui';
import { InstallCommand } from '../components/InstallCommand';

export function McpShowcaseSection() {
    return (
        <section className="geti-home-showcase geti-home-showcase--stacked" aria-label="@geti-ui/mcp">
            <div className="geti-home-showcase__inner">
                <div className="geti-home-showcase__text">
                    <p className="geti-home-showcase__kicker">AI Integration</p>
                    <h2 className="geti-home-showcase__title">@geti-ui/mcp</h2>
                    <p className="geti-home-showcase__desc">
                        An MCP server that exposes Geti UI documentation to AI coding agents. Integrates with Claude
                        Code, Cursor, VS Code Copilot, and Windsurf. Provides 8 tools for searching docs, listing
                        components, extracting props, and more.
                    </p>
                    <InstallCommand command="npx @geti-ui/mcp" />
                    <div className="geti-home-showcase__meta">
                        <Badge variant="info">8 tools for AI agents</Badge>
                        <a className="geti-home-showcase__link" href="/ai/overview">
                            Read MCP docs &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
