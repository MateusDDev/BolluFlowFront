import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { formatAddress } from '@/shared/helpers/addressHelper'
import { cn } from '@/shared/lib/utils'
import {
    MenuStoreAddress,
    OrderFormState,
} from '@/features/menu/types/menu.types'

type Props = {
    form: OrderFormState
    onFieldChange: <K extends keyof OrderFormState>(
        field: K,
        value: OrderFormState[K]
    ) => void
    onWhatsappBlur: () => void
    storeAddress: MenuStoreAddress | null
}

const inputClassName =
    'bg-menu-card border-menu-border text-menu-text placeholder:text-menu-muted'

const FULFILLMENT_OPTIONS = [
    { isPickup: false, label: 'Entrega' },
    { isPickup: true, label: 'Retirar na doceria' },
]

export function CustomerForm({
    form,
    onFieldChange,
    onWhatsappBlur,
    storeAddress,
}: Props) {
    const isPickup = form.isPickup && storeAddress !== null

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label className="text-menu-text">WhatsApp *</Label>
                <Input
                    value={form.customerWhatsapp}
                    onChange={(e) =>
                        onFieldChange('customerWhatsapp', e.target.value)
                    }
                    onBlur={onWhatsappBlur}
                    className={inputClassName}
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-menu-text">Nome *</Label>
                <Input
                    value={form.customerName}
                    onChange={(e) =>
                        onFieldChange('customerName', e.target.value)
                    }
                    className={inputClassName}
                />
            </div>

            {storeAddress ? (
                <div
                    role="group"
                    aria-label="Como receber o pedido"
                    className="grid grid-cols-2 gap-2"
                >
                    {FULFILLMENT_OPTIONS.map((option) => {
                        const selected = option.isPickup === isPickup

                        return (
                            <button
                                key={option.label}
                                type="button"
                                aria-pressed={selected}
                                onClick={() =>
                                    onFieldChange('isPickup', option.isPickup)
                                }
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
            ) : null}

            {isPickup && storeAddress ? (
                <div className="rounded-xl border border-menu-border bg-menu-card p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-menu-muted">
                        Endereço para retirada
                    </p>
                    <p className="mt-1 text-sm font-semibold text-menu-text">
                        {formatAddress(storeAddress)}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-2">
                        <Label className="text-menu-text">Rua *</Label>
                        <Input
                            value={form.customerStreet}
                            onChange={(e) =>
                                onFieldChange('customerStreet', e.target.value)
                            }
                            className={inputClassName}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Número *"
                            inputMode="numeric"
                            value={form.customerNumber}
                            onChange={(e) =>
                                onFieldChange(
                                    'customerNumber',
                                    e.target.value.replace(/\D/g, '')
                                )
                            }
                            className={inputClassName}
                        />

                        <Input
                            placeholder="Bairro *"
                            value={form.customerNeighborhood}
                            onChange={(e) =>
                                onFieldChange(
                                    'customerNeighborhood',
                                    e.target.value
                                )
                            }
                            className={inputClassName}
                        />
                    </div>

                    <Input
                        placeholder="Ponto de referência"
                        value={form.customerComplement}
                        onChange={(e) =>
                            onFieldChange('customerComplement', e.target.value)
                        }
                        className={inputClassName}
                    />
                </>
            )}

            <Textarea
                placeholder="Observações"
                value={form.note}
                onChange={(e) => onFieldChange('note', e.target.value)}
                className={inputClassName}
            />
        </div>
    )
}
