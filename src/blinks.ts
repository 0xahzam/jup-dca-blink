import { ActionGetResponse } from "@solana/actions";

export const getDepositAction = (): ActionGetResponse => {
  const icon =
    "https://image.lexica.art/full_webp/137513ea-76f3-4222-97e2-c323f70619e8";
  const label = "DCA";
  const title = "Buy $SEND using JUP DCA 🐳";
  const description = "Buy in on the next best token";
  const disabled = false;

  const amountQuery = "amount";
  const orderQuery = "order";
  const frequencyQuery = "frequency";

  const links: ActionGetResponse["links"] = {
    actions: [
      {
        label: "Setup DCA",
        href: `/dca?amount={${amountQuery}}&order={${orderQuery}}&frequency={${frequencyQuery}}`,
        parameters: [
          {
            name: amountQuery,
            label: "Amount in USDC",
          },
          {
            name: orderQuery,
            label: "How much $SEND do you wanna buy at a time",
          },
          {
            name: frequencyQuery,
            label: "And, how frequently? (In minutes eg 30)",
          },
        ],
      },
    ],
  };

  const response: ActionGetResponse = {
    icon,
    label,
    title,
    description,
    disabled,
    links,
  };

  return response;
};
