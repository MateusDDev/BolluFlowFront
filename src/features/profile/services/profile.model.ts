export type ProfileModel = {
    name: string
    slug: string | null
    whatsappMessageTemplate: string | null
    indirectCostRate: number
}

export type UpdateProfileDataType = Partial<ProfileModel>
