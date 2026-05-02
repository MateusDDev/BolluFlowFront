import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    getPublicMenu,
    getPublicMenuProducts,
} from '@/features/menu/services/menu.api'
import { PublicApiError } from '@/shared/api/publicClient'

function isNotFoundError(error: unknown) {
    return (error as PublicApiError | undefined)?.status === 404
}

export function useMenuData(slug: string) {
    const menuQuery = useQuery({
        queryKey: ['public-menu', slug],
        queryFn: () => getPublicMenu(slug),
        enabled: Boolean(slug),
        retry: false,
    })

    const productsQuery = useQuery({
        queryKey: ['public-menu-products', slug],
        queryFn: () => getPublicMenuProducts(slug),
        enabled: Boolean(slug) && !isNotFoundError(menuQuery.error),
        retry: false,
    })

    return useMemo(
        () => ({
            menu: menuQuery.data,
            products: productsQuery.data ?? [],
            isLoading: menuQuery.isLoading || productsQuery.isLoading,
            notFound: isNotFoundError(menuQuery.error),
            hasError:
                Boolean(menuQuery.error && !isNotFoundError(menuQuery.error)) ||
                Boolean(productsQuery.error),
        }),
        [
            menuQuery.data,
            menuQuery.error,
            menuQuery.isLoading,
            productsQuery.data,
            productsQuery.error,
            productsQuery.isLoading,
        ]
    )
}
