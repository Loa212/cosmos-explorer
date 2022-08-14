import { createRouter } from "./context";
import { z } from "zod";

export const transactionsRouter = createRouter().query("getTxs", {
  input: z.object({
    address: z.string({
      required_error: "Address is required",
      invalid_type_error: "Address must be a string",
    }),
    from: z.number(),
  }),
  async resolve({ input }) {
    const apiUrl = `https://api.cosmostation.io/v1/account/new_txs/${input.address}?limit=20&from=${input.from}`;

    const res = await fetch(apiUrl);
    if (res.status != 200) {
      throw new Error("failed to fetch transactions");
    }
    const transactions = await res.json();
    return transactions;
  },
});
