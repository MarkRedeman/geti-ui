import React, { useState } from 'react';
import { ThemeProvider } from '@geti/ui';

interface ExampleCardProps {
  title: string;
  code: string;
  children: React.ReactNode;
}

export function ExampleCard({ title, code, children }: ExampleCardProps) {
  const [showCode, setShowCode] = useState(false);

  return (
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
        {title}
      </h3>

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
        <ThemeProvider>{children}</ThemeProvider>
      </div>

      <div
        style={{
          borderTop: '1px solid #333',
          background: '#111',
          padding: '0.5rem 1rem',
        }}
      >
        <button
          onClick={() => setShowCode((prev) => !prev)}
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
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
