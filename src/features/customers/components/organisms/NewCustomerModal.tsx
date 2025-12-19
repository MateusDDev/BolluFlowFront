import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import React, { useState } from 'react'
import { useCreateCustomer } from '@/features/customers/hooks/mutations/useCreateCustomer'
import { BirthdayCalendar } from '@/features/customers/components/atoms/BirthdayCalendar'
import { Textarea } from 'ui/textarea'
import { useMe } from '@/features/login/hooks/useMe'

const NewCustomerModal = () => {
    const [name, setName] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [birthday, setBirthday] = React.useState<Date>()
    const [preferences, setPreferences] = useState<string>()
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState(0)
    const [neighborhood, setNeighborhood] = useState('')
    const { data: me } = useMe()

    const { mutateAsync: createCustomer, error } = useCreateCustomer()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await createCustomer({
            userId: me?.id ?? 0,
            name,
            whatsapp,
            birthday,
            preferences,
            deliveryAddress: {
                neighborhood,
                number,
                street,
            },
        })
    }

    function formatWhatsapp(value: string) {
        const digits = value.replace(/\D/g, '')

        if (!digits) return ''

        if (digits.length <= 2) return `(${digits}`

        if (digits.length <= 7)
            return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Novo cliente</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo cliente</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do cliente e clique em salvar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome</Label>
                        <Input
                            placeholder="Nome do cliente"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Whatsapp</Label>
                        <Input
                            placeholder="(73) 99999-9999"
                            value={whatsapp}
                            onChange={(e) =>
                                setWhatsapp(formatWhatsapp(e.target.value))
                            }
                        />
                    </div>

                    <BirthdayCalendar
                        date={birthday}
                        setDateAction={setBirthday}
                    />

                    <div className="grid gap-3">
                        <Label>Preferências</Label>
                        <Textarea
                            placeholder="Trocar chocolate amargo por chocolate branco"
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Endereço de entrega</Label>

                        <Input
                            placeholder="Rua / Avenida"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />

                        <div className="grid grid-cols-3 gap-2">
                            <Input
                                placeholder="Número"
                                value={number}
                                onChange={(e) =>
                                    setNumber(Number(e.target.value))
                                }
                            />

                            <Input
                                placeholder="Bairro"
                                value={neighborhood}
                                onChange={(e) =>
                                    setNeighborhood(e.target.value)
                                }
                                className="col-span-2"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>

                            <Button type="submit">Adicionar</Button>
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

export default NewCustomerModal
