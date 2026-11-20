import { AppModule } from '@/shared/modules/modules'

export interface UserModel {
    id: number
    name: string
    email: string
    token: string
    profileImageUrl?: string
    slug: string | null
    createdAt: Date
    enabledModules: AppModule[]
    allowNegativeStock: boolean
    onboardingCompletedAt: string | null
}
