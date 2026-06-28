interface BaseEmailProps {
  children: React.ReactNode;
  title?: string;
  previewText?: string;
}

export function BaseEmail({ children, title, previewText }: BaseEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        {previewText && (
          <meta name="preview" content={previewText} />
        )}
        <title>{title ?? "Postmate"}</title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", padding: 40, backgroundColor: "#f5f5f5" }}>
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: 8,
            padding: 32,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ color: "#111", fontSize: 24, margin: 0 }}>Postmate</h1>
          </div>
          {children}
          <div
            style={{
              marginTop: 32,
              paddingTop: 16,
              borderTop: "1px solid #e5e5e5",
              fontSize: 12,
              color: "#666",
            }}
          >
            <p>Sent from Postmate</p>
          </div>
        </div>
      </body>
    </html>
  );
}
