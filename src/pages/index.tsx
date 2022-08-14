import Head from "next/head";
import HomeLayout from "../layouts/HomeLayout";
import { NextPageWithLayout } from "./_app";
import { MdSearch } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/router";

const Home: NextPageWithLayout = () => {
  const [Address, setAddress] = useState("");
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Kirk - cosmos explorer</title>
        <meta name="description" content="cosmos explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grow flex flex-col">
        <div className="relative lg:my-6 grow bg-slate-100 ring-1 ring-slate-700/20 max-w-3xl mx-auto w-full rounded-lg p-6 lg:p-8 text-slate-700">
          <h1 className="text-4xl text-center text-violet-800 font-medium py-2">
            Cosmos explorer
          </h1>
          <p className="text-center text-slate-700/80">
            Drop a wallet address in the box below to see transacion history.
          </p>
          <div className="my-8 flex flex-col lg:flex-row gap-4 items-center justify-between w-full ">
            <input
              type="search"
              className="grow w-full p-2 ring-1 ring-slate-700/20 rounded text-slate-700 focus:outline-violet-700/60  focus:ring-4 focus:ring-offset-2 focus:ring-violet-600/10"
              placeholder="search by wallet address"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              className="flex w-full lg:w-auto items-center justify-center gap-x-2 disabled:bg-opacity-40 bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                router.push("/search/" + Address + "?page=0");
              }}
              disabled={!Address}
            >
              Search
              <MdSearch className="text-lg" />
            </button>
          </div>
          <div>
            <p className="text-slate-700/80 font-medium text-lg py-2 lg:text-2xl lg:pb-8">
              Transactions:
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};
