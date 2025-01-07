import {generateAcessToken} from "../lib/paypal";

// Test to generate access token from paypal
test("generates token from paypal", async () => {
  const response = await generateAcessToken();
  console.log(response);
  expect(typeof response).toBe("string");
  expect(response.length).toBeGreaterThan(0);
});
