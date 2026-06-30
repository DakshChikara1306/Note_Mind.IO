import Stripe from "stripe";
import Usermodel from "../models/usermodel.js"; // Fixed casing to match usage below
import dotenv from "dotenv";
dotenv.config();

// Initialize Stripe instance correctly
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CREDIT_MAP = {
    100: 50,
    200: 120,
    500: 300,
};

export const createCreditSession = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount } = req.body;

        if (!CREDIT_MAP[amount]) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${CREDIT_MAP[amount]} Credits`,
                        },
                        unit_amount: amount * 100, // Stripe expects amounts in cents/paise
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId.toString(), // Ensure it's passed as a string
                credits: CREDIT_MAP[amount].toString(), // Metadata values must be strings
            },
        });

        return res.status(200).json({ url: session.url });
        
    } catch (err) {
        console.error("Stripe Session Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        // req.body here MUST be the raw request body (Buffer), not parsed JSON
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("X Webhook signature error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const creditsToAdd = Number(session.metadata.credits);

        if (!userId || !creditsToAdd) {
            return res.status(400).json({ message: "Invalid metadata" });
        }

        try {
            await Usermodel.findByIdAndUpdate(
                userId,
                {
                    $inc: { credits: creditsToAdd },
                    $set: { isCreditAvailable: true },
                },
                { new: true }
            );
        } catch (dbError) {
            console.error("Database update error during webhook:", dbError);
            return res.status(500).json({ error: "Database update failed" });
        }
    }

    // Return a 200 response to Stripe to acknowledge receipt of the event
    return res.status(200).json({ received: true });
};