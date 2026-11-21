import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'
import { cn } from '@/shared/lib/utils'
import { PaymentMethod } from '@/features/orders/services/order.model'
import { PixKeyCopy } from '@/features/menu/components/PixKeyCopy'

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
    { value: 'Pix', label: 'Pix' },
    { value: 'Cash', label: 'Dinheiro' },
    { value: 'CreditCard', label: 'Crédito' },
    { value: 'DebitCard', label: 'Débito' },
]

type Props = {
    value: PaymentMethod | null
    onChange: (value: PaymentMethod) => void
    changeFor: string
    onChangeForChange: (value: string) => void
    pixKey?: string | null
}

export function MenuPaymentPicker({
    value,
    onChange,
    changeFor,
    onChangeForChange,
    pixKey,
}: Props) {
    return (
        <div className="grid gap-3">
            <div className="grid gap-2">
                <Label className="text-menu-text">Forma de pagamento *</Label>
                <div
                    role="group"
                    aria-label="Forma de pagamento"
                    className="flex flex-wrap gap-2"
                >
                    {PAYMENT_OPTIONS.map((option) => {
                        const selected = option.value === value

                        return (
                            <button
                                key={option.value}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => onChange(option.value)}
                                className={cn(
                                    'rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-primary',
                                    selected
                                        ? 'border-menu-primary bg-menu-primary text-menu-primary-foreground'
                                        : 'border-menu-border bg-menu-card text-menu-text hover:border-menu-primary/60'
                                )}
                            >
                                {option.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {value === 'Cash' ? (
                <div className="grid gap-2">
                    <Label htmlFor="menu-change-for" className="text-menu-text">
                        Troco para quanto? (opcional)
                    </Label>
                    <Input
                        id="menu-change-for"
                        inputMode="numeric"
                        placeholder="Não preciso de troco"
                        value={
                            changeFor ? formatCurrencyFromInput(changeFor) : ''
                        }
                        onChange={(event) =>
                            onChangeForChange(
                                event.target.value.replace(/\D/g, '')
                            )
                        }
                        className="border-menu-border bg-menu-card text-menu-text placeholder:text-menu-muted"
                    />
                </div>
            ) : null}

            {value === 'Pix' && pixKey ? <PixKeyCopy pixKey={pixKey} /> : null}
        </div>
    )
}
