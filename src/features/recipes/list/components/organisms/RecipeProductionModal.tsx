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
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { useGetRecipeConversions } from '@/features/recipes/hooks/queries/useGetRecipeConversions'
import { useCreateRecipeProduction } from '@/features/recipes/hooks/mutations/useCreateRecipeProduction'
import { RecipeStockErrorModel } from '@/features/recipes/services/recipeStock.api'

type Props = {
    recipe: RecipeModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

const BASE_OPTION_VALUE = '__base__'

export function RecipeProductionModal({ recipe, open, onOpenChange }: Props) {
    const [selectedConversion, setSelectedConversion] = useState(BASE_OPTION_VALUE)
    const [quantityInput, setQuantityInput] = useState('')
    const [notes, setNotes] = useState('')
    const [formMessage, setFormMessage] = useState<string | null>(null)
    const [insufficientIngredients, setInsufficientIngredients] =
        useState<RecipeStockErrorModel['insufficientIngredients']>()

    const { data: customConversions, isLoading } = useGetRecipeConversions(
        recipe.id,
        open
    )

    const { mutateAsync: createRecipeProduction, isPending } =
        useCreateRecipeProduction()

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
            : availableConversions.find((item) => item.value === selectedConversion)
                  ?.label ?? 'un'

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormMessage(null)
        setInsufficientIngredients(undefined)

        if (Number.isNaN(quantity) || quantity <= 0) return

        try {
            await createRecipeProduction({
                recipeId: recipe.id,
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
            const apiError = error as RecipeStockErrorModel

            if (apiError.code === 'INSUFFICIENT_STOCK') {
                setFormMessage('Estoque insuficiente para produzir esta receita:')
                setInsufficientIngredients(apiError.insufficientIngredients)
                return
            }

            setFormMessage('Não foi possível registrar a produção. Tente novamente.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Registrar produção</DialogTitle>
                    <DialogDescription>
                        Registre a produção da receita para atualizar o estoque.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
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
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label} = {option.quantityInBaseUnit} un
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Quantidade produzida</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 2"
                            value={quantityInput}
                            onChange={(e) =>
                                setQuantityInput(e.target.value.replace(/[^\d,.]/g, ''))
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
                            {quantity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}{' '}
                            {selectedLabel}
                        </strong>{' '}
                        e os ingredientes serão debitados automaticamente.
                    </div>

                    {!!insufficientIngredients?.length && (
                        <div className="rounded border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                            <p className="font-medium mb-2">{formMessage}</p>
                            <ul className="list-disc pl-5 space-y-1">
                                {insufficientIngredients.map((item) => (
                                    <li key={item.ingredientId}>
                                        {item.ingredientName} — necessário:{' '}
                                        {item.required.toLocaleString('pt-BR')} {item.unit},
                                        disponível: {item.available.toLocaleString('pt-BR')}{' '}
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
                                isPending || Number.isNaN(quantity) || quantity <= 0
                            }
                        >
                            {isPending ? 'Salvando...' : 'Registrar produção'}
                        </Button>
                    </DialogFooter>

                    {formMessage && !insufficientIngredients?.length && (
                        <p className="text-sm text-muted-foreground">{formMessage}</p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
