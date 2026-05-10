import Head from "next/head";
import type { FC } from "react";

interface PageHelmetProps {
  title: string;
  description: string;
}

const PageHelmet: FC<PageHelmetProps> = ({ title = "", description }) => {
  return (
    <Head>
      <title>{`Allen Reviewer — ${title}`}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default PageHelmet;