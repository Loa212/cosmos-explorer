/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "GET") {
    return res
      .status(500)
      .json({ message: "sorry we accept GET requests only" });
  }
  try {
    const response = await _getWalletTransactions(req);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(response));
  } catch (error) {
    return res.status(500).end(JSON.stringify(error));
  }
};

const _getWalletTransactions = async (req: NextApiRequest) => {
  const address = req.query.address;
  if (!address) {
    throw new Error("address is required");
  }
  //from is the header.id of the last transaction in the array || zero
  const from = req.query.from || 0;
  const apiUrl = `https://api.cosmostation.io/v1/account/new_txs/${address}?limit=20&from=${from}`;
  //TODO:fetch DB for transactions

  //TODO:get transactions from [cosmostation] api starting from latest DB block

  //get all transactions
  const res = await fetch(apiUrl);
  if (res.status != 200) {
    throw new Error("failed to fetch transactions");
  }
  const transactions = await res.json();
  return transactions;
};
