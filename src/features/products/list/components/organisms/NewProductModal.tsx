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
import { Textarea } from 'ui/textarea'
import React, { useState } from 'react'
import { useCreateProduct } from '@/features/products/list/hooks/mutations/useCreateProduct'
import { CreateProductDataType } from '@/features/products/services/product.api'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'

export const NewProductModal = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [salePrice, setSalePrice] = useState('')
    const { mutateAsync: createProduct, isPending, error } = useCreateProduct()

    const resetForm = () => {
        setName('')
        setDescription('')
        setCategory('')
        setSalePrice('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateProductDataType = {
            name,
        }

        payload.description = description.trim() || null

        if (category.trim()) {
            payload.category = category.trim()
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

            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Novo produto</DialogTitle>
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
                        <Label>Preço de venda</Label>
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
                        <Label>Descrição</Label>
                        <Textarea
                            placeholder="Ex: Bolo fofinho com cobertura de chocolate..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Categoria</Label>
                        <Input
                            placeholder="Ex: Bolos, Brigadeiros, Kits..."
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
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
