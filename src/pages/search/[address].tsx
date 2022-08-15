import { formatDistance } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import PaginationControls from "../../components/PaginationControls";
import SpinnerIcon from "../../components/SpinnerIcon";
import HomeLayout from "../../layouts/HomeLayout";
import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";

const Search: NextPageWithLayout = () => {
  const router = useRouter();
  const { address, page } = router.query;
  const pageInt = parseInt(page as string);
  const [Address, setAddress] = useState("");
  const [LastTxId, setLastTxId] = useState(0);

  useEffect(() => {
    if (address) {
      setAddress(address as string);
    }
  }, [address]);

  const { isFetching, error, data } = trpc.useQuery([
    "transactionsgetTxs",
    {
      address: address as string,
      from: LastTxId,
    },
  ]);

  function showTxInPage(index: number, pageInt: number) {
    if (index >= pageInt * 4 && index < (pageInt + 1) * 4) {
      return true;
    }
  }

  return (
    <>
      <Head>
        <title>Kirk - cosmos explorer</title>
        <meta name="description" content="cosmos explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grow flex flex-col">
        <div className="relative lg:my-6 grow bg-slate-100 ring-1 ring-slate-700/20 max-w-3xl mx-auto w-full rounded-lg p-2 py-6 lg:p-8 text-slate-700">
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
              disabled={isFetching}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              className="flex w-full lg:w-auto items-center justify-center gap-x-2 disabled:bg-opacity-40 bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                router.push("/search/" + Address + "?page=" + 0);
              }}
              disabled={!Address || isFetching}
            >
              Search
              {isFetching ? <SpinnerIcon /> : <MdSearch className="text-lg" />}
            </button>
          </div>
          <div>
            <p className="text-slate-700/80 font-medium text-lg py-2 lg:text-2xl lg:pb-4">
              Transactions:
            </p>
            <div className="grid grid-cols-4 text-center w-full font-medium text-slate-700 text-sm items-center justify-between py-2 px-2 ">
              <p>Tx Hash</p>
              <p>Amount</p>
              <p>Time</p>
              <p>Status</p>
            </div>
            {isFetching ? (
              <p>Loading...</p>
            ) : data ? (
              <>
                {data.length > 0 ? (
                  <div className="lg:py-4">
                    <PaginationControls Length={Math.ceil(data.length / 4)} />
                    <ul className="space-y-4 text-slate-700">
                      {data.map((tx: any, index: number) => {
                        if (showTxInPage(index, pageInt)) {
                          return <Transaction tx={tx} key={tx.data.txhash} />;
                        }
                      })}
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
  const start = hash.substring(0, 4);
  const end = hash.substring(hash.length - 4, hash.length);
  return `${start}...${end}`;
};

const getTxAmount = (tx: any) => {
  const msgs = tx.data.tx.body.messages;
  let retVal = 0;
  msgs.forEach((msg: any) => {
    if (Object.keys(msg).includes("amount")) {
      if (Array.isArray(msg.amount)) {
        retVal = parseFloat(msg.amount[0]?.amount) / 1000000;
      } else {
        retVal = parseFloat(msg.amount.amount) / 1000000;
      }
    }
  });
  return retVal.toString().split(".");
};

function Transaction({ tx }: { tx: any }) {
  return (
    <li className="bg-slate-200 hover:bg-slate-300 text-xs p-2 rounded-md shadow-sm grid grid-cols-4 w-full items-center text-center justify-between">
      <p className="">{clampHash(tx.data.txhash)}</p>
      <p>
        {getTxAmount(tx)[0]}
        {getTxAmount(tx)[1] ? (
          <span className="text-xxs">. {getTxAmount(tx)[1]}</span>
        ) : (
          ""
        )}

        <span className="text-violet-700">ATOM</span>
      </p>
      {formatDistance(new Date(tx.data.timestamp), new Date(), {
        addSuffix: true,
      })}
      {tx.data.data ? <p>✅</p> : <p>❌</p>}
    </li>
  );
}
