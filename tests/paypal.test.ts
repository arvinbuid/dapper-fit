import {generateAcessToken, paypal} from "../lib/paypal";

// Test to generate access token from paypal
test("generates token from paypal", async () => {
  const tokenResponse = await generateAcessToken();
  console.log(tokenResponse);
  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});

// Test to create a paypal order
test("creates a paypal order", async () => {
  const price = 10.0;

  const orderResponse = await paypal.createOrder(price);
  console.log(orderResponse);
  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

// Test to capture payment with mock order
test("simulate capturing payment from an order", async () => {
  const orderId = "100";

  // Mock the capture payment
  const mockCapturePayment = jest.spyOn(paypal, "capturePayment").mockResolvedValue({
    status: "COMPLETED",
  });

  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  mockCapturePayment.mockRestore();
});
