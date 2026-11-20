'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from 'ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from 'ui/card'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Switch } from 'ui/switch'
import { useMe } from '@/features/login/hooks/useMe'
import { updateProfile } from '@/features/profile/services/profile.api'
import { useCompleteOnboarding } from '@/features/onboarding/hooks/mutations/useCompleteOnboarding'
import { ModuleOptionCard } from '@/features/onboarding/components/ModuleOptionCard'
import { APP_MODULES, AppModule } from '@/shared/modules/modules'
import { navItems } from '@/shared/navigation/items'
import { sanitizeSlug } from '@/shared/helpers/slugHelper'

const STEPS = ['Seu negócio', 'O que você faz', 'Pronto'] as const

export default function OnboardingWizard() {
    const router = useRouter()
    const { data: user } = useMe()
    const { mutateAsync: completeOnboarding } = useCompleteOnboarding()

    const [step, setStep] = useState(0)
    const [name, setName] = useState(user?.name ?? '')
    const [whatsapp, setWhatsapp] = useState('')
    const [slug, setSlug] = useState('')
    const [modules, setModules] = useState<AppModule[]>(['orders', 'finance'])
    const [blockWithoutStock, setBlockWithoutStock] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const normalizedSlug = sanitizeSlug(slug)
    const hasStock = modules.includes('stock')
    const visibleMenu = navItems.filter(
        (item) => !item.modules || item.modules.some((m) => modules.includes(m))
    )

    const toggleModule = (module: AppModule) => {
        setModules((current) =>
            current.includes(module)
                ? current.filter((m) => m !== module)
                : [...current, module]
        )
    }

    const canContinue =
        (step === 0 && name.trim().length >= 2) ||
        (step === 1 && modules.length > 0) ||
        step === 2

    const handleFinish = async () => {
        setIsSaving(true)
        setError(null)

        try {
            await updateProfile({
                name: name.trim(),
                whatsapp: whatsapp.trim(),
                ...(normalizedSlug ? { slug: normalizedSlug } : {}),
                allowNegativeStock: hasStock ? !blockWithoutStock : true,
            })

            await completeOnboarding({ enabledModules: modules })
            router.replace('/')
        } catch (e) {
            setError(
                e instanceof Error ? e.message : 'Não foi possível concluir'
            )
            setIsSaving(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <p className="text-muted-foreground text-sm">
                    Passo {step + 1} de {STEPS.length} · {STEPS[step]}
                </p>
                <div className="flex gap-1 pt-1">
                    {STEPS.map((label, index) => (
                        <span
                            key={label}
                            className={`h-1 flex-1 rounded-full ${index <= step ? 'bg-primary' : 'bg-muted'}`}
                        />
                    ))}
                </div>

                {step === 0 && (
                    <>
                        <CardTitle className="pt-4 text-2xl">
                            Bem-vindo ao BolluFlow!
                        </CardTitle>
                        <CardDescription>
                            Conte um pouco sobre o seu negócio. Dá para mudar
                            tudo depois em Configurações.
                        </CardDescription>
                    </>
                )}

                {step === 1 && (
                    <>
                        <CardTitle className="pt-4 text-2xl">
                            O que você quer fazer por aqui?
                        </CardTitle>
                        <CardDescription>
                            Escolha só o que faz sentido hoje. O menu mostra
                            apenas o que você marcar.
                        </CardDescription>
                    </>
                )}

                {step === 2 && (
                    <>
                        <CardTitle className="pt-4 text-2xl">
                            Tudo pronto
                        </CardTitle>
                        <CardDescription>
                            Este é o menu que você vai usar. Você pode ligar ou
                            desligar áreas quando quiser.
                        </CardDescription>
                    </>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {step === 0 && (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="onboarding-name">
                                Nome do negócio *
                            </Label>
                            <Input
                                id="onboarding-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Doceria da Ana"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="onboarding-whatsapp">
                                WhatsApp
                            </Label>
                            <Input
                                id="onboarding-whatsapp"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="(11) 99999-0000"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="onboarding-slug">
                                Endereço do cardápio online
                            </Label>
                            <Input
                                id="onboarding-slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="doceria-da-ana"
                            />
                            <p className="text-muted-foreground text-sm">
                                {normalizedSlug
                                    ? `Seus clientes vão pedir em /cardapio/${normalizedSlug}`
                                    : 'Opcional. Pode deixar para depois.'}
                            </p>
                        </div>
                    </>
                )}

                {step === 1 && (
                    <div className="grid gap-3">
                        {APP_MODULES.map((module) => (
                            <div key={module.key} className="space-y-2">
                                <ModuleOptionCard
                                    module={module}
                                    selected={modules.includes(module.key)}
                                    onToggle={() => toggleModule(module.key)}
                                />
                                {module.key === 'stock' && hasStock && (
                                    <label className="ml-8 flex items-center justify-between gap-4 rounded-lg border border-dashed p-3 text-sm">
                                        <span>
                                            Bloquear pedidos e produções quando
                                            faltar estoque
                                            <span className="text-muted-foreground block">
                                                Desligado, o saldo pode ficar
                                                negativo.
                                            </span>
                                        </span>
                                        <Switch
                                            checked={blockWithoutStock}
                                            onCheckedChange={
                                                setBlockWithoutStock
                                            }
                                        />
                                    </label>
                                )}
                            </div>
                        ))}
                        <p className="text-muted-foreground text-sm">
                            Produtos e Dashboard ficam sempre disponíveis.
                        </p>
                    </div>
                )}

                {step === 2 && (
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {visibleMenu.map((item) => (
                            <li
                                key={item.url}
                                className="flex items-center gap-2 rounded-lg border p-3"
                            >
                                <item.icon className="text-primary h-4 w-4" />
                                {item.title}
                            </li>
                        ))}
                    </ul>
                )}

                {error && <p className="text-destructive text-sm">{error}</p>}
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button
                    variant="ghost"
                    onClick={() => setStep((s) => s - 1)}
                    disabled={step === 0 || isSaving}
                >
                    Voltar
                </Button>

                {step < STEPS.length - 1 ? (
                    <Button
                        onClick={() => setStep((s) => s + 1)}
                        disabled={!canContinue}
                    >
                        Continuar
                    </Button>
                ) : (
                    <Button onClick={handleFinish} disabled={isSaving}>
                        {isSaving ? 'Salvando...' : 'Começar a usar'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
