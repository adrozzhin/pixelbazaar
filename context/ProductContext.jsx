'use client'

import { createContext, useContext, useEffect, useState } from "react"

const ProductContext = createContext()

const CART_STORAGE_KEY = 'pixelbazaar_cart'

export default function ProductsProvider(props) {
    const { children } = props

    // Important: do NOT read localStorage during initial render.
    // If you do, server HTML (empty cart) won't match client HTML (persisted cart), causing hydration errors.
    const [cart, setCart] = useState({})
    const [hasHydratedCart, setHasHydratedCart] = useState(false)

    useEffect(() => {
        if (!window?.localStorage) return
        try {
            const raw = window.localStorage.getItem(CART_STORAGE_KEY)
            setCart(raw ? JSON.parse(raw) : {})
        } catch {
            setCart({})
        } finally {
            setHasHydratedCart(true)
        }
    }, [])

    function persistCart(nextCart) {
        if (typeof window === 'undefined') return
        if (!window.localStorage) return
        try {
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart))
        } catch {
            // ignore storage failures (private browsing, quota, etc.)
        }
    }

    function handleIncrementProduct(price_id, num, data, noIncrement = false) {
        const newCart = {
            ...cart
        }

        // Mobile number inputs can emit intermediate values like '' while the user is editing.
        // Treat non-finite values as "no change" instead of deleting the item.
        const normalizedNum = typeof num === 'string' ? parseInt(num, 10) : num
        if (!Number.isFinite(normalizedNum)) {
            return
        }

        if (price_id in cart) {
            // turns out the product is already in the cart so take the previous value and increment/decrement it
            // newCart[price_id] = newCart[price_id] + num
            newCart[price_id] = {
                ...data,
                quantity: noIncrement ? normalizedNum : (parseInt(newCart[price_id]?.quantity, 10) + normalizedNum)
            }
        } else {
            // product not yet in cart, so add it
            newCart[price_id] = {
                ...data,
                quantity: normalizedNum
            }
        }

        if (parseInt(newCart[price_id].quantity) <= 0) {
            // the user has set the number to 0, so we need to remove the product from the cart
            delete newCart[price_id]
        }

        // overwrite the cart state with the newCart object
        setCart(newCart)
        persistCart(newCart)

    }

    const value = {
        cart,
        hasHydratedCart,
        handleIncrementProduct,
    }

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProducts = () => useContext(ProductContext)