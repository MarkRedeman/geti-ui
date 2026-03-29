import { startServer } from './server.js';

const VERSION = '0.0.1';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('@geti-ui/mcp - Geti UI documentation MCP server');
    console.log('');
    console.log('Usage: npx @geti-ui/mcp');
    console.log('');
    console.log('Environment variables:');
    console.log('  DOCS_BASE_URL  Fetch docs from a remote URL instead of bundled data');
    console.log('  DOCS_DIR       Read docs from a local directory instead of bundled data');
    process.exit(0);
}

startServer(VERSION).catch((err) => {
    console.error('Failed to start MCP server:', err);
    process.exit(1);
});
