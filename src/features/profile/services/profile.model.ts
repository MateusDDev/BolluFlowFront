import { AppModule } from '@/shared/modules/modules'

export type ProfileModel = {
    name: string
    slug: string | null
    whatsappMessageTemplate: string | null
    indirectCostRate: number
    whatsapp: string | null
    enabledModules: AppModule[]
    allowNegativeStock: boolean
    deliveryTimeMinutes: number | null
    pixKey: string | null
    storeAddress: StoreAddressModel | null
}

export type StoreAddressModel = {
    street: string
    number: number
    neighborhood: string
    complement: string | null
}

export type UpdateProfileDataType = Partial<ProfileModel>
