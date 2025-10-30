import "./global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>Belospeitos Ciberneticos</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
