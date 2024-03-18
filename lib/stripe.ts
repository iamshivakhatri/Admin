

const stripe = require('stripe')(process.env.STRIPE_API_KEY);
export default stripe;
