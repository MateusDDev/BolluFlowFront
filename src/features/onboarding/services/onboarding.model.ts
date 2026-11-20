import { AppModule } from '@/shared/modules/modules'

export type CompleteOnboardingData = {
    enabledModules: AppModule[]
}

export type OnboardingProgressModel = {
    hasProduct: boolean
    hasPricedProduct: boolean
    hasCustomer: boolean
    hasOrder: boolean
    hasMenuLink: boolean
    hasRecipe: boolean
    hasProductComponent: boolean
    hasTrackedStock: boolean
    hasFinancialEntry: boolean
}
