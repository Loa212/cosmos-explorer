import Head from "next/head";
import HomeLayout from "../layouts/HomeLayout";
// import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";
import { MdSearch } from "react-icons/md";
import { useState } from "react";
import SpinnerIcon from "../components/SpinnerIcon";

const clampHash = (hash: string) => {
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 6, hash.length);
  return `${start}...${end}`;
};

const Home: NextPageWithLayout = () => {
  // const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  // const address = "cosmos1vl5j0anles8ejmf4qf69h99r3zazw0ydmpsy4p";

  const [Address, setAddress] = useState("");
  const [Txs, setTxs] = useState<null | Array<any>>(null);
  const [Loading, setLoading] = useState(false);

  const searchTxs = async () => {
    setLoading(true);
    const res = await fetch("api/getWalletTransactions?address=" + Address);
    if (res.ok) {
      const json = await res.json();
      setTxs(json);
      console.log(json);
    } else {
      setTxs(null);
      console.log(res.statusText);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Kirk - cosmos explorer</title>
        <meta name="description" content="cosmos explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grow bg-slate-100 ring-1 ring-slate-700/20 max-w-3xl mx-auto w-full lg:my-8 rounded-lg p-6 lg:p-8 text-slate-700">
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
            disabled={Loading}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            className="flex w-full lg:w-auto items-center justify-center gap-x-2 disabled:bg-opacity-40 bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
            onClick={searchTxs}
            disabled={!Address || Loading}
          >
            Search
            {Loading ? <SpinnerIcon /> : <MdSearch className="text-lg" />}
          </button>
        </div>
        <div>
          <p className="text-slate-700/80 font-medium text-lg py-2">
            Transactions:
          </p>
          {Loading ? (
            <p>Loading...</p>
          ) : Txs ? (
            <ul className="space-y-4 text-slate-700">
              {Txs.map((tx) => (
                <Transaction tx={tx} key={tx.data.txhash} />
              ))}
            </ul>
          ) : (
            <p className="text-slate-700/80">No transactions</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

function Transaction({ tx }: { tx: any }) {
  return (
    <li className="bg-slate-200 px-1 py-2 lg:px-4 rounded-md shadow-sm flex items-center justify-between">
      <p className="text-xs text-ellipsis overflow-clip">
        {clampHash(tx.data.txhash)}
      </p>
      {tx.data.data ? <p>✅</p> : <p>❌</p>}
    </li>
  );
}
