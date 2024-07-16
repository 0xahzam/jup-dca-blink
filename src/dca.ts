import { DCA, Network, type CreateDCAParamsV2 } from "@jup-ag/dca-sdk";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");

const dca = new DCA(connection, Network.MAINNET);

const USDC_MAINNET = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

const SEND_MAINNET = new PublicKey(
  "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa"
);

export async function createDCA(
  user: PublicKey,
  amount: number,
  amountPerCycle: number,
  frequency: number
) {
  try {
    const params: CreateDCAParamsV2 = {
      payer: user,
      user: user,
      inAmount: BigInt(amount * 1e6),
      inAmountPerCycle: BigInt(amountPerCycle * 1e6),
      cycleSecondsApart: BigInt(60 * frequency),
      inputMint: USDC_MAINNET,
      outputMint: SEND_MAINNET,
      minOutAmountPerCycle: null,
      maxOutAmountPerCycle: null,
      startAt: null,
    };

    const { tx } = await dca.createDcaV2(params);

    const blockHash = await connection.getLatestBlockhash();

    tx.feePayer = user;
    tx.recentBlockhash = blockHash.blockhash;
    tx.lastValidBlockHeight = blockHash.lastValidBlockHeight;

    const serialised = Buffer.from(
      tx.serialize({ verifySignatures: false })
    ).toString("base64");

    return { transaction: serialised, message: "DCA Successfull" };
  } catch (e) {
    console.error(e);
    return null;
  }
}
