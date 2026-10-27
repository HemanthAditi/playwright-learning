import { test, expect } from "@playwright/test";

test("Get a single product from DummyJSON", async ({ request }) => {
  const response = await request.get("https://dummyjson.com/products/9999");
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBe(1);
  expect(body.title).toBeTruthy();
});
