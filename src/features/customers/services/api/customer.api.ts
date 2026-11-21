import { CustomerModel } from './customer.model'
import { apiClient } from '@/shared/api/client'

export function getCustomers() {
    return apiClient<CustomerModel[]>(`/customers`, 'GET')
}

export function createCustomer(data: {
    name: string
    whatsapp: string
    preferences?: string
    birthday?: Date | null
    deliveryAddress?: {
        street: string
        number: number
        neighborhood: string
        complement?: string
    }
}) {
    return apiClient<CustomerModel>('/customers', 'POST', data)
}

export function updateCustomer(id: number, data: Partial<CustomerModel>) {
    return apiClient<CustomerModel>(`/customers/${id}`, 'PUT', data)
}

export function deleteCustomer(id: number) {
    return apiClient<null>(`/customers/${id}`, 'DELETE')
}
