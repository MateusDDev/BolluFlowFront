import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { OrderFormState } from '@/features/menu/types/menu.types'

type Props = {
    form: OrderFormState
    onFieldChange: <K extends keyof OrderFormState>(
        field: K,
        value: OrderFormState[K]
    ) => void
    onWhatsappBlur: () => void
}

export function CustomerForm({ form, onFieldChange, onWhatsappBlur }: Props) {
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
                    className="bg-menu-card border-menu-border text-menu-text placeholder:text-menu-muted"
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-menu-text">Nome *</Label>
                <Input
                    value={form.customerName}
                    onChange={(e) =>
                        onFieldChange('customerName', e.target.value)
                    }
                    className="bg-menu-card border-menu-border text-menu-text"
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-menu-text">Rua *</Label>
                <Input
                    value={form.customerStreet}
                    onChange={(e) =>
                        onFieldChange('customerStreet', e.target.value)
                    }
                    className="bg-menu-card border-menu-border text-menu-text"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    placeholder="Número"
                    value={form.customerNumber}
                    onChange={(e) =>
                        onFieldChange('customerNumber', e.target.value)
                    }
                    className="bg-menu-card border-menu-border text-menu-text"
                />

                <Input
                    placeholder="Bairro"
                    value={form.customerNeighborhood}
                    onChange={(e) =>
                        onFieldChange('customerNeighborhood', e.target.value)
                    }
                    className="bg-menu-card border-menu-border text-menu-text"
                />
            </div>

            <Textarea
                placeholder="Observações"
                value={form.note}
                onChange={(e) => onFieldChange('note', e.target.value)}
                className="bg-menu-card border-menu-border text-menu-text placeholder:text-menu-muted"
            />
        </div>
    )
}
