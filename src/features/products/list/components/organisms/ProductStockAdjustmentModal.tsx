import { FormEvent, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { useCreateProductStockAdjustment } from '@/features/products/hooks/mutations/useCreateProductStockAdjustment'

type Props = {
    productId: number
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProductStockAdjustmentModal({
    productId,
    open,
    onOpenChange,
}: Props) {
    const [direction, setDirection] = useState<'add' | 'remove'>('add')
    const [quantityInput, setQuantityInput] = useState('')
    const [reason, setReason] = useState('')
    const [formMessage, setFormMessage] = useState<string | null>(null)

    const { mutateAsync: createStockAdjustment, isPending } =
        useCreateProductStockAdjustment()

    const quantity = Number(quantityInput.replace(',', '.'))
    const isValidReason = reason.trim().length >= 3

    const previewMessage =
        direction === 'add'
            ? `Será adicionado ${quantity || 0} un ao estoque.`
            : `Será removido ${quantity || 0} un do estoque.`

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormMessage(null)

        if (Number.isNaN(quantity) || quantity <= 0) return
        if (!isValidReason) return

        try {
            await createStockAdjustment({
                productId,
                data: {
                    quantity,
                    direction,
                    reason: reason.trim(),
                },
            })

            setDirection('add')
            setQuantityInput('')
            setReason('')
            setFormMessage('Correção de estoque registrada com sucesso!')
            onOpenChange(false)
        } catch {
            setFormMessage(
                'Não foi possível corrigir o estoque. Tente novamente.'
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Corrigir estoque</DialogTitle>
                    <DialogDescription>
                        Use esta opção para corrigir lançamentos incorretos de
                        estoque do produto.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Tipo de ajuste</Label>
                        <Select
                            value={direction}
                            onValueChange={(value) =>
                                setDirection(value as 'add' | 'remove')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o ajuste" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="add">
                                    Adicionar estoque
                                </SelectItem>
                                <SelectItem value="remove">
                                    Remover estoque
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Quantidade</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 3"
                            value={quantityInput}
                            onChange={(event) =>
                                setQuantityInput(
                                    event.target.value.replace(/[^\d,.]/g, '')
                                )
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Motivo da correção</Label>
                        <Input
                            placeholder="Ex: Correção de lançamento incorreto"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            required
                        />
                    </div>

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        {previewMessage}
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                Number.isNaN(quantity) ||
                                quantity <= 0 ||
                                !isValidReason
                            }
                        >
                            {isPending ? 'Salvando...' : 'Confirmar correção'}
                        </Button>
                    </DialogFooter>

                    {formMessage && (
                        <p className="text-sm text-muted-foreground">
                            {formMessage}
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
