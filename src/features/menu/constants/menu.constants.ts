import { OrderFormState } from '@/features/menu/types/menu.types'

export const CUSTOMER_STORAGE_KEY = (whatsapp: string) =>
    `cardapio_customer_${whatsapp.replace(/\D/g, '')}`

export const initialOrderFormState: OrderFormState = {
    customerName: '',
    customerWhatsapp: '',
    customerStreet: '',
    customerNumber: '',
    customerNeighborhood: '',
    customerComplement: '',
    isPickup: false,
    note: '',
    paymentMethod: null,
    changeFor: '',
}
