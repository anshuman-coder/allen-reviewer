import Head from "next/head";
import Script from "next/script";
import type { FC } from "react";

interface PageHelmetProps {
  title: string;
  description: string;
  withPrism?: boolean;
}

const PageHelmet: FC<PageHelmetProps> = ({ title = "", description, withPrism = false }) => {
  return (
    <>
      <Head>
        <title>{`Allen Reviewer — ${title}`}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {withPrism && (
        <>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" strategy="afterInteractive" />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js" strategy="afterInteractive" />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js" strategy="afterInteractive" />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js" strategy="afterInteractive" />
        </>
      )}
    </>
  );
};

export default PageHelmet;