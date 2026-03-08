import React, { useState, ComponentType, ErrorInfo, ReactNode } from 'react';
import { ThemeProvider } from '@geti/ui';

interface StoryObj {
  render?: (args: Record<string, unknown>) => React.ReactNode;
  args?: Record<string, unknown>;
  decorators?: Array<(Story: ComponentType) => React.ReactNode>;
  name?: string;
  parameters?: {
    docs?: {
      source?: {
        code?: string;
      };
    };
  };
}

interface StoriesMeta {
  component?: ComponentType<Record<string, unknown>>;
  args?: Record<string, unknown>;
  decorators?: Array<(Story: ComponentType) => React.ReactNode>;
  parameters?: {
    docs?: {
      source?: {
        code?: string;
      };
    };
  };
}

interface StoriesModule {
  default: StoriesMeta;
  [key: string]: StoryObj | StoriesMeta;
}

interface StoriesGalleryProps {
  module: StoriesModule;
  component?: ComponentType<Record<string, unknown>>;
  componentName?: string;
}

/** Top-level error boundary for the entire StoriesGallery */
class StoriesGalleryErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in StoriesGallery:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            marginTop: '2rem',
            padding: '2rem',
            background: '#1a1a1a',
            border: '1px solid #f87171',
            borderRadius: '8px',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: '#f87171',
            }}
          >
            Unable to render examples
          </h2>
          <p style={{ color: '#aaa', margin: 0 }}>
            {this.state.error?.message || 'An error occurred while rendering the stories.'}
          </p>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '1rem' }}>
            This is likely due to missing component imports in the story file.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Error boundary to catch render errors in individual story cards */
class StoryErrorBoundary extends React.Component<
  { children: ReactNode; storyName: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; storyName: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error rendering story "${this.props.storyName}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: '#1a1a1a',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80px',
          }}
        >
          <span style={{ color: '#f87171', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            ⚠ Render error: {this.state.error?.message || 'Unknown error'}
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Convert PascalCase or camelCase to a readable string. e.g. `WithAction` → `With Action` */
function humanize(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^[\s_]+/, '')
    .trim();
}

/** Render a single story given its object and the meta, returning a React node. */
function renderStory(
  story: StoryObj,
  meta: StoriesMeta,
  component?: ComponentType<Record<string, unknown>>
): React.ReactNode {
  const mergedArgs: Record<string, unknown> = {
    ...(meta.args ?? {}),
    ...(story.args ?? {}),
  };

  // Build the innermost rendered content
  let content: React.ReactNode;
  if (story.render) {
    content = story.render(mergedArgs);
  } else if (component) {
    const MetaComponent = component;
    content = <MetaComponent {...mergedArgs} />;
  } else {
    content = null;
  }

  // Apply story decorators (innermost = last in array, so reverse-apply)
  const storyDecorators = story.decorators ?? [];
  for (let i = storyDecorators.length - 1; i >= 0; i--) {
    const decorator = storyDecorators[i];
    const inner = content;
    const StoryComponent: ComponentType = () => <>{inner}</>;
    content = decorator(StoryComponent);
  }

  // Apply meta decorators (outermost = last in array, so reverse-apply)
  const metaDecorators = meta.decorators ?? [];
  for (let i = metaDecorators.length - 1; i >= 0; i--) {
    const decorator = metaDecorators[i];
    const inner = content;
    const StoryComponent: ComponentType = () => <>{inner}</>;
    content = decorator(StoryComponent);
  }

  return content;
}

function normalizeComponentName(name: string | undefined): string {
  if (!name) return 'Component';
  const segment = name.includes('_') ? name.split('_').at(-1) || name : name;
  return segment.replace(/[^A-Za-z0-9]/g, '') || 'Component';
}

function toJsxValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return `{${String(value)}}`;
  if (value === null) return '{null}';
  if (value === undefined) return '{undefined}';
  if (typeof value === 'function') return '{() => { /* ... */ }}';

  try {
    return `{${JSON.stringify(value, null, 2)}}`;
  } catch {
    return '{/* complex value */}';
  }
}

function buildAutoJsxSnippet(
  story: StoryObj,
  meta: StoriesMeta,
  component?: ComponentType<Record<string, unknown>>,
  componentNameOverride?: string
): string {
  const mergedArgs: Record<string, unknown> = {
    ...(meta.args ?? {}),
    ...(story.args ?? {}),
  };

  const componentName = normalizeComponentName(
    componentNameOverride || component?.displayName || component?.name
  );
  const children = mergedArgs.children;
  const entries = Object.entries(mergedArgs).filter(([key]) => key !== 'children');

  const propLines = entries.map(([key, value]) => `  ${key}=${toJsxValue(value)}`);
  const openTag = propLines.length > 0 ? `<${componentName}\n${propLines.join('\n')}` : `<${componentName}`;

  if (children === undefined || children === null) {
    return `${openTag} />`;
  }

  const childrenText = typeof children === 'string' ? children : `{${String(children)}}`;
  return `${openTag}>\n  ${childrenText}\n</${componentName}>`;
}

function getStoryCode(
  name: string,
  story: StoryObj,
  meta: StoriesMeta,
  component?: ComponentType<Record<string, unknown>>,
  componentNameOverride?: string
): string {
  // 1) Prefer explicit docs source if provided by the story/meta.
  const explicitCode = story.parameters?.docs?.source?.code ?? meta.parameters?.docs?.source?.code;
  if (explicitCode?.trim()) return explicitCode;

  // 2) If story has render fn, show concise render skeleton.
  if (story.render) {
    return `export const ${name} = {\n  render: (args) => (\n    /* custom render */\n  )\n};`;
  }

  // 3) Fallback: generate JSX from merged args.
  return buildAutoJsxSnippet(story, meta, component, componentNameOverride);
}

function StoryCard({
  name,
  story,
  meta,
  component,
  componentName,
}: {
  name: string;
  story: StoryObj;
  meta: StoriesMeta;
  component?: ComponentType<Record<string, unknown>>;
  componentName?: string;
}) {
  const [showCode, setShowCode] = useState(false);

  const humanStoryName = humanize(story.name ?? name);

  return (
    <StoryErrorBoundary storyName={humanStoryName}>
      <div
        style={{
          marginBottom: '2rem',
          border: '1px solid #333',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <h3
          style={{
            margin: 0,
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: 600,
            background: '#111',
            borderBottom: '1px solid #333',
            color: '#e0e0e0',
          }}
        >
          {humanStoryName}
        </h3>

        {/* Demo area */}
        <div
          style={{
            background: '#1d1d1d',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80px',
          }}
        >
          <StoryContent story={story} meta={meta} component={component} />
        </div>

        {/* Toggle button */}
        <div
          style={{
            borderTop: '1px solid #333',
            background: '#111',
            padding: '0.5rem 1rem',
          }}
        >
          <button
            onClick={() => setShowCode((prev: boolean) => !prev)}
            style={{
              background: 'transparent',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#aaa',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: '0.25rem 0.75rem',
            }}
          >
            {showCode ? 'Hide code' : 'Show code'}
          </button>
        </div>

        {/* Code block */}
        {showCode && (
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              background: '#0d0d0d',
              borderTop: '1px solid #333',
              overflow: 'auto',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              color: '#cdd6f4',
              maxHeight: '400px',
            }}
          >
            <code>{getStoryCode(name, story, meta, component, componentName)}</code>
          </pre>
        )}
      </div>
    </StoryErrorBoundary>
  );
}

/** Render just the story content, with its own error handling */
function StoryContent({
  story,
  meta,
  component,
}: {
  story: StoryObj;
  meta: StoriesMeta;
  component?: ComponentType<Record<string, unknown>>;
}) {
  const [error, setError] = useState<string | null>(null);

  let rendered: React.ReactNode = null;
  if (!error) {
    try {
      rendered = renderStory(story, meta, component);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    }
  }

  if (error) {
    return (
      <span style={{ color: '#f87171', fontFamily: 'monospace', fontSize: '0.85rem' }}>
        ⚠ Render error: {error}
      </span>
    );
  }

  return <ThemeProvider>{rendered}</ThemeProvider>;
}

export const StoriesGallery = ({ module, component: explicitComponent, componentName }: StoriesGalleryProps) => {
  const meta = module.default as StoriesMeta;
  // Use explicit component if provided, otherwise fall back to meta.component
  const component = explicitComponent ?? meta.component;

  const storyEntries = Object.entries(module).filter(
    ([key]) => key !== 'default'
  ) as Array<[string, StoryObj]>;

  return (
    <StoriesGalleryErrorBoundary>
      <section style={{ marginTop: '2rem' }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            color: '#e0e0e0',
          }}
        >
          Examples
        </h2>

        {storyEntries.map(([name, story]) => (
          <StoryCard
            key={name}
            name={name}
            story={story}
            meta={meta}
            component={component}
            componentName={componentName}
          />
        ))}
      </section>
    </StoriesGalleryErrorBoundary>
  );
};

export default StoriesGallery;
