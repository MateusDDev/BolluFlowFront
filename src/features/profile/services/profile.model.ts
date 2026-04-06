export type ProfileModel = {
    name: string
    whatsappMessageTemplate: string | null
    indirectCostRate: number
}

export type UpdateProfileDataType = Partial<ProfileModel>
