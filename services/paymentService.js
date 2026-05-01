const crypto = require("crypto");

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return {
      enabled: false,
      reason: "Razorpay keys are not configured."
    };
  }

  try {
    const Razorpay = require("razorpay");
    return {
      enabled: true,
      keyId,
      client: new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      })
    };
  } catch (error) {
    return {
      enabled: false,
      reason: "Install the razorpay package to enable live payments."
    };
  }
}

async function createOrder({ amount, receipt }) {
  const razorpay = getRazorpayClient();

  if (!razorpay.enabled) {
    return {
      paymentEnabled: false,
      reason: razorpay.reason
    };
  }

  const order = await razorpay.client.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
    payment_capture: 1
  });

  return {
    paymentEnabled: true,
    keyId: razorpay.keyId,
    order
  };
}

function verifySignature({ orderId, paymentId, signature }) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expectedSignature === signature;
}

module.exports = {
  createOrder,
  verifySignature
};
