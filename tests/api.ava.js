import { app } from "../src/index.js";
import test from "ava";
import request from "supertest";

import { logger } from "../src/logger.js";
logger.level = "error";

test("GET /", async (t) => {
  const res = await request(app).get("/");
  t.is(res.status, 200);
  t.is(res.body.message, "Welcome to the Immutable Contract API");
});

test("GET /test", async (t) => {
  const res = await request(app).get("/test");
  t.is(res.status, 200);
  t.true(res.text.includes("Hello from "));
});

test("GET /verify null account", async (t) => {
  const res = await request(app).get("/verify");
  t.is(res.status, 400);
  t.is(res.body.error, "Missing contract_account_id parameter");
});

test("GET /verify invalid account", async (t) => {
  const res = await request(app).get("/verify?contract_account_id=invalid");
  t.is(res.status, 500);
});

test("GET /verify valid account (with deployed contract)", async (t) => {
  const res = await request(app).get("/verify?contract_account_id=immutable.idea404.testnet");
  t.is(res.status, 200);
  t.is(res.body.immutable, true);
});
