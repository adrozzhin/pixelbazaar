'use client'

import { useProducts } from "@/context/ProductContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
    const router = useRouter()
    const { cart, handleIncrementProduct } = useProducts()

    // Keep quantity input editable (can be cleared) without immediately mutating cart state.
    // We commit on blur/Enter to avoid mobile number-input quirks.
    const [quantityDrafts, setQuantityDrafts] = useState({})

    useEffect(() => {
        // Drop drafts for items no longer in cart
        setQuantityDrafts((prev) => {
            const next = { ...prev }
            Object.keys(next).forEach((priceId) => {
                if (!(priceId in cart)) {
                    delete next[priceId]
                }
            })
            return next
        })
    }, [cart])

    // Challenge item - calculate the total cost of items in cart
    const total = Object.keys(cart).reduce((acc, curr) => {
        // use the reduce function to interative cumulate a value

        // 1. use the price_id to find the data for the product in the cart
        const cartItem = cart[curr]

        // 2. find the quantity of said product
        const quantity = cartItem.quantity

        // 3. find the cost in cents of said product
        const cost = cartItem.prices[0].unit_amount

        // 4. take the current total (acc) and add on to it the quantity of the current product multiplied by it's cost
        const sum = acc + cost * quantity

        // 5. return the sum which then becomes the accumlated value for the next iteration
        return sum
    }, 0)

    async function createCheckout() {
        try {
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL
            const lineItems = Object.keys(cart).map((item, itemIndex) => {
                return {
                    price: item,
                    quantity: cart[item].quantity
                }
            })

            const response = await fetch(baseURL + '/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ lineItems })
            })
            const data = await response.json()
            if (response.ok) {
                console.log(data)
                router.push(data.url)
            } else {
                alert(data?.error || 'Checkout is disabled for this demo.')
            }
        } catch (err) {
            console.log('Error creating checkout', err.message)
            alert('Checkout is disabled for this demo.')
        }
    }

    return (
        <section className="cart-section">
            <h2>Your Cart</h2>
            <p className="demo-note"><strong>Portfolio demo:</strong> checkout uses <strong>Stripe test mode (sandbox)</strong>. No real charges are made.</p>
            {Object.keys(cart).length === 0 && (<p>You have no items in your cart!</p>)}
            <div className="cart-container">
                {Object.keys(cart).map((item, itemIndex) => {
                    const itemData = cart[item]
                    const itemQuantity = itemData?.quantity
                    const draftValue = quantityDrafts?.[item]

                    const imgName = itemData.name === 'Medieval Dragon Month Planner' ?
                        'planner' :
                        itemData.name.replaceAll(' Sticker.png', '').replaceAll(' ', '_')
                    const imgUrl = '/low_res/' + imgName + '.jpeg'

                    return (
                        <div key={itemIndex} className="cart-item">
                            <img src={imgUrl} alt={imgName + '-img'} />
                            <div className="cart-item-info">
                                <h3>{itemData.name}</h3>
                                <p>{itemData.description.slice(0, 100)}{itemData.description.length > 100 ? '...' : ''} </p>
                                <h4>${itemData.prices[0].unit_amount / 100}</h4>
                                <div className="quantity-container">
                                    <p><strong>Quantity</strong></p>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        step="1"
                                        value={draftValue ?? itemQuantity}
                                        placeholder="2"
                                        onChange={(e) => {
                                            const raw = e.target.value
                                            setQuantityDrafts((prev) => ({
                                                ...prev,
                                                [item]: raw,
                                            }))
                                        }}
                                        onBlur={(e) => {
                                            const raw = e.target.value
                                            if (raw === '') {
                                                // Revert empty input back to the actual cart value
                                                setQuantityDrafts((prev) => {
                                                    const next = { ...prev }
                                                    delete next[item]
                                                    return next
                                                })
                                                return
                                            }

                                            const nextQuantity = parseInt(raw, 10)
                                            if (!Number.isFinite(nextQuantity)) {
                                                setQuantityDrafts((prev) => {
                                                    const next = { ...prev }
                                                    delete next[item]
                                                    return next
                                                })
                                                return
                                            }

                                            const clamped = Math.max(0, nextQuantity)
                                            handleIncrementProduct(itemData.default_price, clamped, itemData, true)
                                            setQuantityDrafts((prev) => {
                                                const next = { ...prev }
                                                delete next[item]
                                                return next
                                            })
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.currentTarget.blur()
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="checkout-container">
                <Link href={'/'}>
                    <button>&larr; Continue shopping</button>
                </Link>
                <button onClick={createCheckout}>Checkout &rarr;</button>
            </div>
        </section>
    );
}