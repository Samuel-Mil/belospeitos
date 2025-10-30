import "./global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>Stock Speculator</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
