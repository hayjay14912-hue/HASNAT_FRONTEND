import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="icon" href="/assets/img/logo/brand-logo-favicon.png" />
        <link rel="shortcut icon" href="/assets/img/logo/brand-logo-favicon.png" />
        <link rel="apple-touch-icon" href="/assets/img/logo/brand-logo-favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
