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
import { formatWhatsapp } from '@/shared/helpers/formatHelper'

const NewCustomerModal = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [birthday, setBirthday] = React.useState<Date>()
    const [preferences, setPreferences] = useState<string>()
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')
    const [neighborhood, setNeighborhood] = useState('')

    const {
        mutateAsync: createCustomer,
        isPending,
        error,
    } = useCreateCustomer()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await createCustomer({
            name,
            whatsapp,
            birthday,
            preferences,
            deliveryAddress: {
                neighborhood,
                number: Number(number),
                street,
            },
        })

        resetForm()
        setOpen(false)
    }

    const resetForm = () => {
        setName('')
        setWhatsapp('')
        setBirthday(undefined)
        setPreferences('')
        setStreet('')
        setNumber('')
        setNeighborhood('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                        <Label>Nome*</Label>
                        <Input
                            placeholder="Nome do cliente"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <Label>Whatsapp*</Label>
                    <Input
                        placeholder="(73) 99999-9999"
                        value={formatWhatsapp(whatsapp)}
                        onChange={(e) => {
                            const onlyDigits = e.target.value.replace(/\D/g, '')
                            setWhatsapp(onlyDigits)
                        }}
                        required
                    />

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
                        <Label>Endereço de entrega*</Label>

                        <Input
                            placeholder="Rua / Avenida"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                        />

                        <div className="grid grid-cols-3 gap-2">
                            <Input
                                placeholder="Número"
                                value={number}
                                onChange={(e) => {
                                    const onlyNumbers = e.target.value.replace(
                                        /\D/g,
                                        ''
                                    )
                                    setNumber(onlyNumbers)
                                }}
                            />

                            <Input
                                placeholder="Bairro"
                                value={neighborhood}
                                onChange={(e) =>
                                    setNeighborhood(e.target.value)
                                }
                                className="col-span-2"
                                required
                            />
                        </div>
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
                                {isPending ? 'Salvando...' : 'Adicionar'}
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

export default NewCustomerModal
