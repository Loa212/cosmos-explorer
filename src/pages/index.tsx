import Head from "next/head";
import HomeLayout from "../layouts/HomeLayout";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Kirk - cosmos explorer</title>
        <meta name="description" content="cosmos explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grow bg-slate-600 max-w-lg mx-auto w-full my-8 rounded-lg p-8 text-white">
        <h1 className="text-4xl text-center">Kirk is cool</h1>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};
