import { router } from "@trpc/server";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MdArrowBackIos,
  MdArrowForwardIos,
  MdFirstPage,
  MdLastPage,
  MdSearch,
} from "react-icons/md";
import SpinnerIcon from "../../components/SpinnerIcon";
import HomeLayout from "../../layouts/HomeLayout";
import { NextPageWithLayout } from "../_app";

const Search: NextPageWithLayout = () => {
  const router = useRouter();
  const { address, page } = router.query;
  const pageInt = parseInt(page as string);
  const [Address, setAddress] = useState("");
  const [Txs, setTxs] = useState<null | Array<any>>(null);
  const [ResultAddress, setResultAddress] = useState("");
  const [Loading, setLoading] = useState(false);
  const [LastTxId, setLastTxId] = useState(0);

  useEffect(() => {
    if (address) {
      setAddress(address as string);
    }
  }, [address]);

  useEffect(() => {
    const getTsx = async () => {
      setLoading(true);
      const res = await fetch(
        "/api/getWalletTransactions?address=" + address + "&from=" + 0
      );
      if (res.ok) {
        const txs = await res.json();
        //set last tx id to the last tx id of the last tx
        // setLastTxId(txs[txs.length - 1].header.id);
        const txsSplit = [];
        for (let i = 0; i < txs.length; i += 5) {
          txsSplit.push(txs.slice(i, i + 5));
        }
        console.log({ txsSplit });
        setTxs(txsSplit);
        setResultAddress(address as string);
      } else {
        setTxs(null);
        console.log(res.statusText);
      }
      setLoading(false);
    };

    if (!address) return;
    if (!page) return;
    if (ResultAddress === address) return;
    getTsx();

    // return () => {
    //   second
    // }
  }, [address, page, ResultAddress]);

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
              disabled={Loading}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              className="flex w-full lg:w-auto items-center justify-center gap-x-2 disabled:bg-opacity-40 bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                router.push("/search/" + Address + "?page=" + 0);
              }}
              disabled={!Address || Loading}
            >
              Search
              {Loading ? <SpinnerIcon /> : <MdSearch className="text-lg" />}
            </button>
          </div>
          <div>
            <p className="text-slate-700/80 font-medium text-lg py-2 lg:text-2xl lg:pb-4">
              Transactions:
            </p>
            <div className="flex font-medium text-slate-700 text-sm items-center justify-between py-2 px-2 pl-4 pr-2 lg:pl-8">
              <p>Tx Hash</p>
              <p>Status</p>
            </div>
            {Loading ? (
              <p>Loading...</p>
            ) : Txs ? (
              <>
                {Txs.length > 0 ? (
                  <div className="lg:py-4">
                    <PaginationControls Length={Txs.length} />
                    <ul className="space-y-4 text-slate-700">
                      {Txs[pageInt].map((tx: any) => (
                        <Transaction tx={tx} key={tx.data.txhash} />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No transactions found</p>
                )}
              </>
            ) : (
              <p className="text-slate-700/80">No transactions</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

const clampHash = (hash: string) => {
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 6, hash.length);
  return `${start}...${end}`;
};

function Transaction({ tx }: { tx: any }) {
  return (
    <li className="bg-slate-200 hover:bg-slate-300 py-2 px-4 rounded-md shadow-sm flex items-center justify-between">
      <p className="text-xs text-ellipsis overflow-clip">
        {clampHash(tx.data.txhash)}
      </p>
      {tx.data.data ? <p>✅</p> : <p>❌</p>}
    </li>
  );
}

function PaginationControls({ Length }: { Length: number }) {
  const router = useRouter();
  const { address, page } = router.query;
  const pageInt = parseInt(page as string);
  return (
    <div className="absolute flex items-center justify-between bottom-2 inset-x-0  rounded-md mx-2 bg-violet-200 lg:mx-auto lg:max-w-sm">
      <button
        disabled={pageInt === 0}
        onClick={() => {
          router.push(`/search/${address}?page=0`);
        }}
        className="text-2xl p-4 hover:bg-violet-300 disabled:opacity-20"
      >
        <MdFirstPage />
      </button>

      <button
        disabled={pageInt === 0}
        onClick={() => {
          router.push(`/search/${address}?page=${pageInt - 1}`);
        }}
        className="p-5 hover:bg-violet-300 disabled:opacity-20"
      >
        <MdArrowBackIos />
      </button>

      <p className="grow text-center text-slate-700">
        {pageInt + 1} - {Length}
      </p>

      <button
        disabled={pageInt === Length - 1}
        onClick={() => {
          router.push(`/search/${router.query.address}?page=${pageInt + 1}`);
        }}
        className="p-5 hover:bg-violet-300 disabled:opacity-20"
      >
        <MdArrowForwardIos />
      </button>

      <button
        disabled={pageInt === Length - 1}
        onClick={() => {
          router.push(`/search/${address}?page=3`);
        }}
        className="text-2xl p-4 hover:bg-violet-300 disabled:opacity-20"
      >
        <MdLastPage />
      </button>
    </div>
  );
}
