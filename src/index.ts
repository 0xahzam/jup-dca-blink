import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { getDepositAction } from "./blinks";
import { PublicKey } from "@solana/web3.js";
import { createDCA } from "./dca";
import { ActionError } from "@solana/actions";

const app = new Hono();

app.use(logger());

app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Content-Encoding",
      "Accept-Encoding",
    ],
  })
);

app.options("*", (c) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Encoding, Accept-Encoding"
  );
  return c.text("OK");
});

app.get("/", (c) => {
  return c.text("gm!");
});

app.get("/actions.json", (c) => {
  return c.json({
    rules: [
      {
        pathPattern: "/blinks/**",
        apiPath: "/deposit/**",
      },
    ],
  });
});

app.get("/blinks", async (c) => {
  try {
    const response = getDepositAction();
    return c.json(response);
  } catch (error) {
    console.error("Error generating deposit action:", error);
    return c.json({ error: "Failed to generate deposit action" }, 500);
  }
});

app.post("/dca", async (c) => {
  try {
    const amount = c.req.query("amount");
    const order = c.req.query("order");
    const frequency = c.req.query("frequency");

    const body = await c.req.json();
    const account = body.account;

    if (!amount || !order || !frequency || !account) {
      return c.json({ error: "Missing required parameters" }, 400);
    }

    const user = new PublicKey(account as string);

    const tx = await createDCA(
      user,
      parseFloat(amount as string),
      parseFloat(order as string),
      parseFloat(frequency as string)
    );

    if (!tx) {
      return c.json(
        { message: "Failed to generate transaction" } as ActionError,
        400
      );
    }

    return c.json(tx);
  } catch (error) {
    console.error("Error processing DCA request:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default {
  port: 3000,
  fetch: app.fetch,
};
