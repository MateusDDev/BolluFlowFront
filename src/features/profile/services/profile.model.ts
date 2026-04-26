export type ProfileModel = {
    name: string
    whatsappMessageTemplate: string | null
    indirectCostRate: number | null
    skipStockCheck: boolean
}

export type UpdateProfileDataType = Partial<ProfileModel>
