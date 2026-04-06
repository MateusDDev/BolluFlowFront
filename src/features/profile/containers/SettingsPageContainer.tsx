'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePageTitle } from 'components/providers/PageTitleProvider'
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
import { Textarea } from 'ui/textarea'
import { badgeVariants } from 'ui/badge'
import { useGetProfile } from '@/features/profile/hooks/queries/useGetProfile'
import { useUpdateProfile } from '@/features/profile/hooks/mutations/useUpdateProfile'

const DEFAULT_WHATSAPP_TEMPLATE_PLACEHOLDER = `Olá, *{customerName}*! 🍰

Segue o resumo do seu pedido:

📦 *Pedido #{orderNumber}*
{items}

💰 *Total: {total}*
💳 Pagamento: {paymentMethod}
📅 Entrega: {deliveryDate}
📍 {address}

Qualquer dúvida estou à disposição! 😊`

const TEMPLATE_VARIABLES = [
    { variable: '{customerName}', label: 'Nome do cliente' },
    { variable: '{orderNumber}', label: 'Número do pedido' },
    { variable: '{items}', label: 'Itens do pedido' },
    { variable: '{total}', label: 'Total' },
    { variable: '{paymentMethod}', label: 'Forma de pagamento' },
    { variable: '{deliveryDate}', label: 'Data de entrega' },
    { variable: '{address}', label: 'Endereço' },
]

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

    const [profileFeedback, setProfileFeedback] = useState<string | null>(null)
    const [templateFeedback, setTemplateFeedback] = useState<string | null>(
        null
    )
    const [pricingFeedback, setPricingFeedback] = useState<string | null>(null)

    useEffect(() => {
        setTitle('Configurações')

        return () => setTitle(null)
    }, [setTitle])

    const currentName = name ?? profile?.name ?? ''
    const currentTemplate =
        whatsappTemplate ?? profile?.whatsappMessageTemplate ?? ''
    const currentIndirectCostRate =
        indirectCostRate ?? (profile?.indirectCostRate ?? 0).toString()

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
                currentTemplate.trim() === '' ? null : currentTemplate,
        })

        setTemplateFeedback('Mensagem padrão salva com sucesso!')
        setWhatsappTemplate(undefined)
    }

    const handleRestoreTemplate = async () => {
        setWhatsappTemplate('')
        await updateProfile({ whatsappMessageTemplate: null })
        setTemplateFeedback('Template restaurado para o padrão com sucesso!')
        setWhatsappTemplate(undefined)
    }

    const handleSaveIndirectCost = async () => {
        if (isInvalidIndirectCost) return

        await updateProfile({
            indirectCostRate: Number(currentIndirectCostRate),
        })
        setPricingFeedback('Precificação salva com sucesso!')
        setIndirectCostRate(undefined)
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

            <Card>
                <CardHeader>
                    <CardTitle>Mensagem padrão do WhatsApp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        ref={textareaRef}
                        rows={12}
                        value={currentTemplate}
                        placeholder={DEFAULT_WHATSAPP_TEMPLATE_PLACEHOLDER}
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
