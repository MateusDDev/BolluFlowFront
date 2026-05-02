import { publicApiClient } from '@/shared/api/publicClient'
import {
    CustomerLookupResponse,
    CreatePublicOrderDataType,
    PublicMenuModel,
    PublicMenuProductModel,
    PublicOrderConfirmationModel,
} from '@/features/menu/types/menu.types'

export function getPublicMenu(slug: string) {
    return publicApiClient<PublicMenuModel>(`/menu/${slug}`, 'GET')
}

export function getPublicMenuProducts(slug: string) {
    return publicApiClient<PublicMenuProductModel[]>(
        `/menu/${slug}/products`,
        'GET'
    )
}

export function lookupPublicCustomer(slug: string, whatsapp: string) {
    return publicApiClient<CustomerLookupResponse>(
        `/menu/${slug}/customers/lookup?whatsapp=${encodeURIComponent(whatsapp)}`,
        'GET'
    )
}

export function createPublicOrder(
    slug: string,
    data: CreatePublicOrderDataType
) {
    return publicApiClient<PublicOrderConfirmationModel>(
        `/menu/${slug}/orders`,
        'POST',
        data
    )
}
