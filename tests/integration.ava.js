import test from "ava";
import { verifier } from "../src/api.js";

import { logger } from "../src/logger.js";
logger.level = "error";

test("verifier null account", async (t) => {
  await t.throwsAsync(verifier(null), {
    message: "contract_account_id is not set",
  });
});

test("verifier invalid account", async (t) => {
  await t.throwsAsync(verifier("invalid"), {
    message:
      "Invalid contract account id: invalid. Expected contract account id to end with .near or .testnet",
  });
});

test("verifier valid mutable account without a deployed contract", async (t) => {
  const res = await verifier("nocontract.idea404.testnet");
  const expected = {
    immutable: false,
    has_deployed_contract: false,
  };
  t.deepEqual(res, expected);
});

test("verifier valid immutable account with deployed contract", async (t) => {
  const res = await verifier("immutable.idea404.testnet");
  const expect = {
    immutable: true,
    has_deployed_contract: true,
  }
  t.deepEqual(res, expect);
});
