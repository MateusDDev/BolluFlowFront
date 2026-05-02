import { useMemo, useState } from 'react'
import {
    CartItem,
    PublicMenuProductModel,
} from '@/features/menu/types/menu.types'

function getProductUnitPrice(product: PublicMenuProductModel) {
    return product.finalPrice ?? product.salePrice ?? product.price ?? 0
}

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>([])

    const addProduct = (product: PublicMenuProductModel) => {
        if (product.isAvailable === false) return

        const unitPrice = getProductUnitPrice(product)

        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) => item.productId === product.id
            )

            if (existingItem) {
                return currentCart.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            return [
                ...currentCart,
                {
                    productId: product.id,
                    productName: product.name,
                    unitPrice,
                    quantity: 1,
                },
            ]
        })
    }

    const removeProduct = (productId: number) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        )
    }

    const clearCart = () => setCart([])

    const totalItems = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    )
    const total = useMemo(
        () =>
            cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
        [cart]
    )

    return {
        cart,
        total,
        totalItems,
        addProduct,
        removeProduct,
        clearCart,
    }
}
