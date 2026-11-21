import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import React, { useEffect, useState } from 'react'
import { Textarea } from 'ui/textarea'
import { formatWhatsapp } from '@/shared/helpers/formatHelper'
import { useUpdateCustomer } from '@/features/customers/hooks/mutations/useUpdateCustomer'
import { CustomerModel } from '@/features/customers/services/api/customer.model'
import { DatePicker } from 'components/DatePicker'

interface EditCustomerModalProps {
    customer: CustomerModel
    open: boolean
    onOpenChange: (isOpen: boolean) => void
}

interface FormState {
    name: string
    whatsapp: string
    birthday?: Date
    preferences: string
    street: string
    number: string
    neighborhood: string
    complement: string
}

const mapCustomerToForm = (customer: CustomerModel): FormState => ({
    name: customer.name,
    whatsapp: customer.whatsapp,
    birthday: customer.birthday ? new Date(customer.birthday) : undefined,
    preferences: customer.preferences ?? '',
    street: customer.deliveryAddress?.street ?? '',
    number: customer.deliveryAddress?.number?.toString() ?? '',
    neighborhood: customer.deliveryAddress?.neighborhood ?? '',
    complement: customer.deliveryAddress?.complement ?? '',
})

const EditCustomerModal = ({
    customer,
    open,
    onOpenChange,
}: EditCustomerModalProps) => {
    const [form, setForm] = useState<FormState>(() =>
        mapCustomerToForm(customer)
    )

    const {
        mutateAsync: updateCustomer,
        error,
        isPending,
    } = useUpdateCustomer()

    useEffect(() => {
        setForm(mapCustomerToForm(customer))
    }, [customer])

    const setField = <K extends keyof FormState>(
        field: K,
        value: FormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await updateCustomer({
            id: customer.id,
            data: {
                name: form.name,
                whatsapp: form.whatsapp,
                birthday: form.birthday,
                preferences: form.preferences,
                deliveryAddress: form.street.trim()
                    ? {
                          street: form.street,
                          number: Number(form.number),
                          neighborhood: form.neighborhood,
                          complement: form.complement.trim() || undefined,
                      }
                    : undefined,
            },
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar cliente</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Atualize os dados do cliente e clique em salvar.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Whatsapp</Label>
                        <Input
                            value={formatWhatsapp(form.whatsapp)}
                            onChange={(e) =>
                                setField(
                                    'whatsapp',
                                    e.target.value.replace(/\D/g, '')
                                )
                            }
                        />
                    </div>

                    <DatePicker
                        date={form.birthday}
                        setDateAction={(date) => setField('birthday', date)}
                        label="Data de aniversário"
                    />

                    <div className="grid gap-3">
                        <Label>Preferências</Label>
                        <Textarea
                            value={form.preferences}
                            onChange={(e) =>
                                setField('preferences', e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Endereço de entrega</Label>

                        <Input
                            placeholder="Rua / Avenida"
                            value={form.street}
                            onChange={(e) => setField('street', e.target.value)}
                        />

                        <div className="grid grid-cols-3 gap-2">
                            <Input
                                placeholder="Número"
                                value={form.number}
                                onChange={(e) =>
                                    setField(
                                        'number',
                                        e.target.value.replace(/\D/g, '')
                                    )
                                }
                            />
                            <Input
                                placeholder="Bairro"
                                value={form.neighborhood}
                                onChange={(e) =>
                                    setField('neighborhood', e.target.value)
                                }
                                className="col-span-2"
                            />
                        </div>

                        <Input
                            placeholder="Ponto de referência"
                            value={form.complement}
                            onChange={(e) =>
                                setField('complement', e.target.value)
                            }
                        />
                    </div>

                    <DialogFooter>
                        <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                >
                                    Cancelar
                                </Button>
                            </DialogClose>

                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? 'Salvando...'
                                    : 'Salvar alterações'}
                            </Button>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">
                                {error.message}
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditCustomerModal
