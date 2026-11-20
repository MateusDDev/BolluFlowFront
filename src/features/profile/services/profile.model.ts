import { AppModule } from '@/shared/modules/modules'

export type ProfileModel = {
    name: string
    slug: string | null
    whatsappMessageTemplate: string | null
    indirectCostRate: number
    whatsapp: string | null
    enabledModules: AppModule[]
    allowNegativeStock: boolean
}

export type UpdateProfileDataType = Partial<ProfileModel>
