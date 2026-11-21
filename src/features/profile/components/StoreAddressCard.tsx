'use client'

import { useState } from 'react'
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
import { useUpdateProfile } from '@/features/profile/hooks/mutations/useUpdateProfile'
import { StoreAddressModel } from '@/features/profile/services/profile.model'

type Props = {
    storeAddress: StoreAddressModel | null
}

type AddressForm = {
    street: string
    number: string
    neighborhood: string
    complement: string
}

function toForm(address: StoreAddressModel | null): AddressForm {
    return {
        street: address?.street ?? '',
        number: address?.number?.toString() ?? '',
        neighborhood: address?.neighborhood ?? '',
        complement: address?.complement ?? '',
    }
}

export function StoreAddressCard({ storeAddress }: Props) {
    const { mutateAsync: updateProfile, isPending } = useUpdateProfile()
    const [form, setForm] = useState<AddressForm | null>(null)
    const [feedback, setFeedback] = useState<string | null>(null)

    const current = form ?? toForm(storeAddress)
    const isEmpty =
        !current.street.trim() &&
        !current.number.trim() &&
        !current.neighborhood.trim() &&
        !current.complement.trim()
    const isComplete =
        current.street.trim() !== '' &&
        current.number.trim() !== '' &&
        current.neighborhood.trim() !== ''
    const isInvalid = !isEmpty && !isComplete

    const setField = (field: keyof AddressForm, value: string) => {
        setFeedback(null)
        setForm({ ...current, [field]: value })
    }

    const handleSave = async () => {
        if (isInvalid) return

        await updateProfile({
            storeAddress: isEmpty
                ? null
                : {
                      street: current.street.trim(),
                      number: Number(current.number),
                      neighborhood: current.neighborhood.trim(),
                      complement: current.complement.trim() || null,
                  },
        })

        setForm(null)
        setFeedback(
            isEmpty ? 'Endereço removido.' : 'Endereço salvo com sucesso!'
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Endereço da doceria (opcional)</CardTitle>
                <CardDescription>
                    Com o endereço preenchido, o cardápio oferece a opção
                    &quot;Retirar na doceria&quot; e mostra onde buscar o
                    pedido.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="store-street">Rua</Label>
                    <Input
                        id="store-street"
                        placeholder="Rua / Avenida"
                        value={current.street}
                        onChange={(event) =>
                            setField('street', event.target.value)
                        }
                    />
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="store-number">Número</Label>
                        <Input
                            id="store-number"
                            inputMode="numeric"
                            value={current.number}
                            onChange={(event) =>
                                setField(
                                    'number',
                                    event.target.value.replace(/\D/g, '')
                                )
                            }
                        />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <Label htmlFor="store-neighborhood">Bairro</Label>
                        <Input
                            id="store-neighborhood"
                            value={current.neighborhood}
                            onChange={(event) =>
                                setField('neighborhood', event.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="store-complement">
                        Ponto de referência (opcional)
                    </Label>
                    <Input
                        id="store-complement"
                        placeholder="Ex.: ao lado da padaria"
                        value={current.complement}
                        onChange={(event) =>
                            setField('complement', event.target.value)
                        }
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <p
                        className={
                            isInvalid
                                ? 'text-sm text-destructive'
                                : 'text-sm text-emerald-600'
                        }
                    >
                        {isInvalid
                            ? 'Preencha rua, número e bairro, ou deixe tudo vazio.'
                            : feedback}
                    </p>
                    <Button
                        onClick={handleSave}
                        disabled={isPending || isInvalid}
                    >
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
