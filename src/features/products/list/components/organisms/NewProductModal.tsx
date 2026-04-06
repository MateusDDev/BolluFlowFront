import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import React, { useState } from 'react'
import { useCreateProduct } from '@/features/products/list/hooks/mutations/useCreateProduct'
import { CreateProductDataType } from '@/features/products/services/product.api'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'
import { useGetProfile } from '@/features/profile/hooks/queries/useGetProfile'

export const NewProductModal = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [salePrice, setSalePrice] = useState('')
    const [indirectCostRate, setIndirectCostRate] = useState<
        string | undefined
    >(undefined)

    const { data: profile } = useGetProfile(open)

    const { mutateAsync: createProduct, isPending, error } = useCreateProduct()

    const currentIndirectCostRate =
        indirectCostRate ?? (profile?.indirectCostRate ?? 0).toString()

    const resetForm = () => {
        setName('')
        setSalePrice('')
        setIndirectCostRate(undefined)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateProductDataType = {
            name,
            indirectCostRate: Number(currentIndirectCostRate) || 0,
        }

        if (salePrice) {
            payload.salePrice = Number(salePrice) / 100
        }

        await createProduct(payload)

        resetForm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Novo produto</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo produto final</DialogTitle>
                    <DialogDescription>
                        Um produto final é composto por receitas, insumos e
                        ingredientes.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome*</Label>
                        <Input
                            placeholder="Nome do produto"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Preco de venda</Label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="R$ 0,00"
                            value={formatCurrencyFromInput(salePrice)}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '')
                                setSalePrice(digits)
                            }}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Custo indireto (%)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            value={currentIndirectCostRate}
                            onChange={(e) =>
                                setIndirectCostRate(e.target.value)
                            }
                        />
                    </div>

                    <DialogFooter className="flex flex-col gap-2">
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
