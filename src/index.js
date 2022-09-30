import express, { json } from "express";
import { hostname } from "os";
import { verifier } from "./api.js";

export const app = express();
const PORT = 3001;

app.use(json());

app.get("/test", (req, res) => {
  res.send(`Hello from ${hostname()}!`);
});

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Immutable Contract API",
    methods: {
      "/verify": {
        method: "GET",
        description: "Get immutable status of a smart contract",
        parameters: {
          contract_account_id: "The contract account ID",
        },
      },
    },
  });
});

app.get("/verify", async (req, res) => {
  const { contract_account_id } = req.query;
  if (!contract_account_id) {
    res.status(400).send({
      error: "Missing contract_account_id parameter",
    });
    return;
  }

  try {
    const result = await verifier(contract_account_id);
    res.send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      error: error.message,
    });
  }
});

app.use((req, res, next) => {
  res.status(404).send({
    message: "Page not found.",
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err,
    message: err.message,
  });
});

app.listen(PORT, () => {
  if (!PORT) {
    throw new Error("PORT is not set");
  }
  console.log(`Server is running on port ${PORT}`);
});
