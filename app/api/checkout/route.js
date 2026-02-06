import Stripe from "stripe"
import '../../../envConfig.js'

const API_KEY = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
const stripe = API_KEY
    ? new Stripe(API_KEY, {
        apiVersion: '2023-10-16'
    })
    : null

export async function POST(request) {
    try {
        if (!stripe) {
            return Response.json(
                { error: 'Stripe is not configured on the server.' },
                { status: 500 }
            )
        }

        if (typeof API_KEY === 'string' && API_KEY.startsWith('sk_live')) {
            return Response.json(
                { error: 'Live Stripe keys are blocked for this portfolio demo. Use a test (sk_test) key.' },
                { status: 400 }
            )
        }

        const { lineItems } = await request.json()
        console.log(lineItems)
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            success_url: process.env.NEXT_PUBLIC_BASE_URL + '/success',
            cancel_url: process.env.NEXT_PUBLIC_BASE_URL + '/'
        })
        return Response.json(session, { status: 200 })
    } catch (err) {
        console.error('Error creating cart checkout ', err.message)
        return Response.json(
            { error: 'Failed to create stripe checkout page' },
            { status: 500 }
        )
    }

}