import { useMemo, useState } from 'react'
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
import { ProductModel } from '@/features/products/services/product.model'
import { useGetProductConversions } from '@/features/products/hooks/queries/useGetProductConversions'
import { useCreateProductProduction } from '@/features/products/hooks/mutations/useCreateProductProduction'
import { ProductStockErrorModel } from '@/features/products/services/productStock.api'
import { useGetProfile } from '@/features/profile/hooks/queries/useGetProfile'

type Props = {
    product: ProductModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

const BASE_OPTION_VALUE = '__base__'

export function ProductProductionModal({ product, open, onOpenChange }: Props) {
    const [selectedConversion, setSelectedConversion] =
        useState(BASE_OPTION_VALUE)
    const [quantityInput, setQuantityInput] = useState('')
    const [notes, setNotes] = useState('')
    const [formMessage, setFormMessage] = useState<string | null>(null)
    const [insufficientComponents, setInsufficientComponents] =
        useState<ProductStockErrorModel['insufficientComponents']>()

    const { data: customConversions, isLoading } = useGetProductConversions(
        product.id,
        open
    )
    const { data: profile } = useGetProfile(open)

    const { mutateAsync: createProductProduction, isPending } =
        useCreateProductProduction()

    const availableConversions = useMemo(() => {
        return (customConversions ?? []).map((item) => ({
            value: String(item.id),
            label: item.name,
            quantityInBaseUnit: item.quantityInBaseUnit,
        }))
    }, [customConversions])

    const selectedFactor = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE) return 1

        const conversion = availableConversions.find(
            (option) => option.value === selectedConversion
        )

        return conversion?.quantityInBaseUnit ?? 1
    }, [selectedConversion, availableConversions])

    const quantity = Number(quantityInput.replace(',', '.'))
    const quantityInBaseUnit =
        !Number.isNaN(quantity) && quantity > 0 ? quantity * selectedFactor : 0

    const selectedLabel =
        selectedConversion === BASE_OPTION_VALUE
            ? 'un'
            : (availableConversions.find(
                  (item) => item.value === selectedConversion
              )?.label ?? 'un')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormMessage(null)
        setInsufficientComponents(undefined)

        if (Number.isNaN(quantity) || quantity <= 0) return

        try {
            await createProductProduction({
                productId: product.id,
                data: {
                    quantity: quantityInBaseUnit,
                    notes: notes.trim() || undefined,
                },
            })

            setQuantityInput('')
            setNotes('')
            setSelectedConversion(BASE_OPTION_VALUE)
            setFormMessage('Produção registrada com sucesso!')
            onOpenChange(false)
        } catch (error) {
            const apiError = error as ProductStockErrorModel

            if (
                apiError.code === 'INSUFFICIENT_STOCK' &&
                !profile?.skipStockCheck
            ) {
                setFormMessage(
                    'Estoque insuficiente para produzir este produto:'
                )
                setInsufficientComponents(apiError.insufficientComponents)
                return
            }

            setFormMessage(
                'Não foi possível registrar a produção. Tente novamente.'
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Registrar produção</DialogTitle>
                    <DialogDescription>
                        {profile?.skipStockCheck
                            ? 'Registre a produção do produto sem verificar o estoque.'
                            : 'Registre a produção do produto para atualizar o estoque.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    {!!availableConversions.length && (
                        <div className="grid gap-2">
                            <Label>Conversão</Label>
                            <Select
                                value={selectedConversion}
                                onValueChange={setSelectedConversion}
                                disabled={isLoading || isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma conversão" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={BASE_OPTION_VALUE}>
                                        Unidade base (un)
                                    </SelectItem>
                                    {availableConversions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label} ={' '}
                                            {option.quantityInBaseUnit} un
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Quantidade produzida</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 2"
                            value={quantityInput}
                            onChange={(e) =>
                                setQuantityInput(
                                    e.target.value.replace(/[^\d,.]/g, '')
                                )
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Observações</Label>
                        <Input
                            placeholder="Ex: Produção da manhã"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        Serão produzidas{' '}
                        <strong>
                            {quantity.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                            })}{' '}
                            {selectedLabel}
                        </strong>{' '}
                        {profile?.skipStockCheck
                            ? 'e o estoque não será verificado nem debitado.'
                            : 'e os componentes serão debitados automaticamente.'}
                    </div>

                    {!!insufficientComponents?.length && (
                        <div className="rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                            <p className="mb-2 font-medium">{formMessage}</p>
                            <ul className="list-disc space-y-1 pl-5">
                                {insufficientComponents.map((item, index) => (
                                    <li key={`${item.componentName}-${index}`}>
                                        {item.componentName} - necessário:{' '}
                                        {item.required.toLocaleString('pt-BR')}{' '}
                                        {item.unit}, disponível:{' '}
                                        {item.available.toLocaleString('pt-BR')}{' '}
                                        {item.unit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                Number.isNaN(quantity) ||
                                quantity <= 0
                            }
                        >
                            {isPending ? 'Salvando...' : 'Registrar produção'}
                        </Button>
                    </DialogFooter>

                    {formMessage && !insufficientComponents?.length && (
                        <p className="text-sm text-muted-foreground">
                            {formMessage}
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
