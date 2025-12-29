import { Customer } from './customer'
import { CustomerModel } from '@/features/customers/services/api/customer.model'

export function mapCustomerModel(model: CustomerModel): Customer {
    return {
        id: model.id,
        userId: model.userId,
        name: model.name,
        whatsapp: model.whatsapp,
        deliveryAddress: model.deliveryAddress,
        birthday: model.birthday,
        preferences: model.preferences,
    }
}
