'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePageTitle } from 'components/providers/PageTitleProvider'
import { badgeVariants } from 'ui/badge'
import { Button } from 'ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'ui/card'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { Separator } from 'ui/separator'
import { Switch } from 'ui/switch'
import { Textarea } from 'ui/textarea'
import { StoreAddressCard } from '@/features/profile/components/StoreAddressCard'
import { useUpdateProfile } from '@/features/profile/hooks/mutations/useUpdateProfile'
import { useGetProfile } from '@/features/profile/hooks/queries/useGetProfile'
import {
    DEFAULT_WHATSAPP_TEMPLATE,
    TEMPLATE_VARIABLES,
} from '@/features/orders/helpers/whatsappTemplate.constants'
import {
    DeliveryTimeUnit,
    splitDeliveryTime,
    toDeliveryTimeMinutes,
} from '@/features/profile/helpers/deliveryTime'
import { sanitizeSlug as sanitizeMenuSlug } from '@/shared/helpers/slugHelper'
import { APP_MODULES, AppModule } from '@/shared/modules/modules'

export default function SettingsPageContainer() {
    const { setTitle } = usePageTitle()
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const { data: profile, isLoading, error } = useGetProfile()
    const { mutateAsync: updateProfile, isPending } = useUpdateProfile()

    const [name, setName] = useState<string | undefined>(undefined)
    const [whatsappTemplate, setWhatsappTemplate] = useState<
        string | undefined
    >(undefined)
    const [indirectCostRate, setIndirectCostRate] = useState<
        string | undefined
    >(undefined)
    const [menuSlug, setMenuSlug] = useState<string | undefined>(undefined)
    const [deliveryTime, setDeliveryTime] = useState<string | undefined>(
        undefined
    )
    const [deliveryTimeUnit, setDeliveryTimeUnit] = useState<
        DeliveryTimeUnit | undefined
    >(undefined)
    const [pixKey, setPixKey] = useState<string | undefined>(undefined)
    const [appOrigin] = useState(() =>
        typeof window === 'undefined' ? '' : window.location.origin
    )

    const [profileFeedback, setProfileFeedback] = useState<string | null>(null)
    const [templateFeedback, setTemplateFeedback] = useState<string | null>(
        null
    )
    const [pricingFeedback, setPricingFeedback] = useState<string | null>(null)
    const [menuFeedback, setMenuFeedback] = useState<string | null>(null)

    useEffect(() => {
        setTitle('Configurações')

        return () => setTitle(null)
    }, [setTitle])

    const currentName = name ?? profile?.name ?? ''
    const currentTemplate =
        whatsappTemplate !== undefined
            ? whatsappTemplate
            : (profile?.whatsappMessageTemplate ?? DEFAULT_WHATSAPP_TEMPLATE)
    const currentIndirectCostRate =
        indirectCostRate ?? (profile?.indirectCostRate ?? 0).toString()
    const currentMenuSlug = menuSlug ?? profile?.slug ?? ''
    const normalizedMenuSlug = sanitizeMenuSlug(currentMenuSlug)
    const storedDeliveryTime = splitDeliveryTime(profile?.deliveryTimeMinutes)
    const currentDeliveryTime = deliveryTime ?? storedDeliveryTime.value
    const currentDeliveryTimeUnit = deliveryTimeUnit ?? storedDeliveryTime.unit
    const deliveryTimeMinutes = toDeliveryTimeMinutes(
        currentDeliveryTime,
        currentDeliveryTimeUnit
    )
    const isInvalidDeliveryTime = deliveryTimeMinutes === undefined
    const currentPixKey = pixKey ?? profile?.pixKey ?? ''
    const publicMenuLink =
        appOrigin && normalizedMenuSlug
            ? `${appOrigin}/cardapio/${normalizedMenuSlug}`
            : ''

    const isInvalidIndirectCost = useMemo(() => {
        const numericValue = Number(currentIndirectCostRate)

        return (
            Number.isNaN(numericValue) || numericValue < 0 || numericValue > 100
        )
    }, [currentIndirectCostRate])

    const handleSaveName = async () => {
        await updateProfile({ name: currentName })
        setProfileFeedback('Perfil salvo com sucesso!')
        setName(undefined)
    }

    const handleSaveTemplate = async () => {
        await updateProfile({
            whatsappMessageTemplate:
                currentTemplate.trim() === '' ? '' : currentTemplate,
        })

        setTemplateFeedback('Mensagem padrão salva com sucesso!')
        setWhatsappTemplate(undefined)
    }

    const handleRestoreTemplate = async () => {
        await updateProfile({ whatsappMessageTemplate: '' })
        setWhatsappTemplate(undefined)
        setTemplateFeedback('Template restaurado para o padrão com sucesso!')
    }

    const handleSaveIndirectCost = async () => {
        if (isInvalidIndirectCost) return

        await updateProfile({
            indirectCostRate: Number(currentIndirectCostRate),
        })
        setPricingFeedback('Precificação salva com sucesso!')
        setIndirectCostRate(undefined)
    }

    const handleSaveMenuSlug = async () => {
        if (!normalizedMenuSlug || deliveryTimeMinutes === undefined) return

        await updateProfile({
            slug: normalizedMenuSlug,
            deliveryTimeMinutes,
            pixKey: currentPixKey.trim() || null,
        })
        setMenuSlug(undefined)
        setDeliveryTime(undefined)
        setDeliveryTimeUnit(undefined)
        setPixKey(undefined)
        setMenuFeedback('Cardápio salvo com sucesso!')
    }

    const handleToggleModule = async (module: AppModule, enabled: boolean) => {
        const current = profile?.enabledModules ?? []
        const enabledModules = enabled
            ? [...current, module]
            : current.filter((m) => m !== module)

        await updateProfile({ enabledModules })
    }

    const handleToggleBlockWithoutStock = async (block: boolean) => {
        await updateProfile({ allowNegativeStock: !block })
    }

    const handleCopyMenuLink = async () => {
        if (!publicMenuLink) return

        await navigator.clipboard.writeText(publicMenuLink)
        setMenuFeedback('Link copiado!')
    }

    const handleInsertVariable = (variable: string) => {
        const textarea = textareaRef.current

        if (!textarea) {
            setWhatsappTemplate(
                (prev) => `${prev ?? currentTemplate}${variable}`
            )
            return
        }

        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const nextValue =
            currentTemplate.slice(0, start) +
            variable +
            currentTemplate.slice(end)

        setWhatsappTemplate(nextValue)

        requestAnimationFrame(() => {
            textarea.focus()
            const nextCursorPosition = start + variable.length
            textarea.setSelectionRange(nextCursorPosition, nextCursorPosition)
        })
    }

    if (isLoading) return <p className="p-8">Carregando configurações...</p>

    if (error || !profile) {
        return (
            <p className="p-8">Não foi possível carregar as configurações.</p>
        )
    }

    return (
        <section className="container mx-auto space-y-6 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="profile-name">Nome da doceria *</Label>
                        <Input
                            id="profile-name"
                            value={currentName}
                            onChange={(event) => {
                                setProfileFeedback(null)
                                setName(event.target.value)
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-emerald-600">
                            {profileFeedback}
                        </p>
                        <Button
                            onClick={handleSaveName}
                            disabled={isPending || !currentName.trim()}
                        >
                            {isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <StoreAddressCard storeAddress={profile.storeAddress} />

            <Card>
                <CardHeader>
                    <CardTitle>Áreas do sistema</CardTitle>
                    <CardDescription>
                        Ligue só o que você usa. Desligar uma área esconde o
                        menu, mas não apaga nenhum dado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {APP_MODULES.map((module) => (
                        <div
                            key={module.key}
                            className="flex items-center justify-between gap-4"
                        >
                            <div>
                                <Label htmlFor={`module-${module.key}`}>
                                    {module.title}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {module.description}
                                </p>
                            </div>
                            <Switch
                                id={`module-${module.key}`}
                                checked={profile.enabledModules.includes(
                                    module.key
                                )}
                                disabled={isPending}
                                onCheckedChange={(checked) =>
                                    handleToggleModule(module.key, checked)
                                }
                            />
                        </div>
                    ))}

                    {profile.enabledModules.includes('stock') && (
                        <>
                            <Separator />
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label htmlFor="block-without-stock">
                                        Bloquear quando faltar estoque
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Desligado, pedidos e produções seguem e
                                        o saldo pode ficar negativo. Só vale
                                        para itens com controle de estoque.
                                    </p>
                                </div>
                                <Switch
                                    id="block-without-stock"
                                    checked={!profile.allowNegativeStock}
                                    disabled={isPending}
                                    onCheckedChange={
                                        handleToggleBlockWithoutStock
                                    }
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cardápio público</CardTitle>
                    <CardDescription>
                        Compartilhe uma página simples para seus clientes
                        visualizarem produtos e fazerem pedidos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="menu-slug">
                            Slug (identificador na URL)
                        </Label>
                        <Input
                            id="menu-slug"
                            placeholder="doceria-da-ana"
                            value={currentMenuSlug}
                            onChange={(event) => {
                                setMenuFeedback(null)
                                setMenuSlug(event.target.value)
                            }}
                        />
                        <p className="text-sm text-muted-foreground">
                            Use letras minúsculas, números e hífens.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="menu-delivery-time">
                            Tempo de entrega (opcional)
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="menu-delivery-time"
                                inputMode="numeric"
                                placeholder="40"
                                className="w-24"
                                value={currentDeliveryTime}
                                onChange={(event) => {
                                    setMenuFeedback(null)
                                    setDeliveryTime(event.target.value)
                                }}
                            />
                            <Select
                                value={currentDeliveryTimeUnit}
                                onValueChange={(value) => {
                                    setMenuFeedback(null)
                                    setDeliveryTimeUnit(
                                        value as DeliveryTimeUnit
                                    )
                                }}
                            >
                                <SelectTrigger
                                    className="w-32"
                                    aria-label="Unidade do tempo de entrega"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="minutes">
                                        minutos
                                    </SelectItem>
                                    <SelectItem value="hours">horas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p
                            className={
                                isInvalidDeliveryTime
                                    ? 'text-sm text-destructive'
                                    : 'text-sm text-muted-foreground'
                            }
                        >
                            {isInvalidDeliveryTime
                                ? 'Informe um número inteiro, de 1 minuto até 24 horas.'
                                : 'Quanto tempo o pedido leva para sair da doceria e chegar ao cliente. Aparece no cardápio.'}
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="menu-pix-key">
                            Chave Pix (opcional)
                        </Label>
                        <Input
                            id="menu-pix-key"
                            placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                            maxLength={140}
                            value={currentPixKey}
                            onChange={(event) => {
                                setMenuFeedback(null)
                                setPixKey(event.target.value)
                            }}
                        />
                        <p className="text-sm text-muted-foreground">
                            Aparece para o cliente que escolher Pix no cardápio,
                            com botão de copiar.
                        </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Link do seu cardápio</Label>
                        <div className="rounded-lg border bg-muted/40 px-3 py-3 text-sm break-all">
                            {publicMenuLink ||
                                'Defina um slug para gerar o link'}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-emerald-600">
                            {menuFeedback}
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCopyMenuLink}
                                disabled={!publicMenuLink}
                            >
                                Copiar link
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                disabled={!publicMenuLink}
                            >
                                <Link
                                    href={publicMenuLink || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Abrir cardápio
                                </Link>
                            </Button>

                            <Button
                                onClick={handleSaveMenuSlug}
                                disabled={
                                    isPending ||
                                    !normalizedMenuSlug ||
                                    isInvalidDeliveryTime
                                }
                            >
                                {isPending ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Mensagem padrão do WhatsApp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        ref={textareaRef}
                        rows={12}
                        value={currentTemplate}
                        placeholder={DEFAULT_WHATSAPP_TEMPLATE}
                        onChange={(event) => {
                            setTemplateFeedback(null)
                            setWhatsappTemplate(event.target.value)
                        }}
                    />

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Variáveis disponíveis:</p>
                        <div className="flex flex-wrap items-center gap-2">
                            {TEMPLATE_VARIABLES.map(({ variable, label }) => (
                                <button
                                    key={variable}
                                    type="button"
                                    className={badgeVariants({
                                        variant: 'outline',
                                    })}
                                    onClick={() =>
                                        handleInsertVariable(variable)
                                    }
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-emerald-600">
                            {templateFeedback}
                        </p>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRestoreTemplate}
                                disabled={isPending}
                            >
                                Restaurar padrão
                            </Button>
                            <Button
                                onClick={handleSaveTemplate}
                                disabled={isPending}
                            >
                                {isPending ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Precificação</CardTitle>
                    <CardDescription>
                        Água, luz, gás, aluguel e outros custos indiretos
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="indirect-cost-rate">
                            Taxa de custo indireto (%)
                        </Label>
                        <Input
                            id="indirect-cost-rate"
                            type="number"
                            min={0}
                            max={100}
                            value={currentIndirectCostRate}
                            onChange={(event) => {
                                setPricingFeedback(null)
                                setIndirectCostRate(event.target.value)
                            }}
                        />
                        <p className="text-sm text-muted-foreground">
                            Esta taxa será aplicada automaticamente na
                            precificação de produtos.
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-emerald-600">
                            {pricingFeedback}
                        </p>
                        <Button
                            onClick={handleSaveIndirectCost}
                            disabled={isPending || isInvalidIndirectCost}
                        >
                            {isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
