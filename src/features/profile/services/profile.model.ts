export type ProfileModel = {
    name: string
    slug: string | null
    whatsappMessageTemplate: string | null
    indirectCostRate: number | null
    skipStockCheck: boolean
}

export type UpdateProfileDataType = Partial<ProfileModel>
