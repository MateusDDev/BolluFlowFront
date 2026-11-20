import { cn } from '@/shared/lib/utils'

export type ChipOption<T extends string> = {
    value: T
    label: string
}

type Props<T extends string> = {
    options: ChipOption<T>[]
    value: T | null
    onChange: (value: T | null) => void
    allowDeselect?: boolean
    ariaLabel: string
}

export function ChipGroup<T extends string>({
    options,
    value,
    onChange,
    allowDeselect = false,
    ariaLabel,
}: Props<T>) {
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className="flex flex-wrap gap-2"
        >
            {options.map((option) => {
                const selected = option.value === value

                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                            onChange(
                                selected && allowDeselect ? null : option.value
                            )
                        }
                        className={cn(
                            'rounded-full border px-3 py-1.5 text-sm transition-colors',
                            selected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'hover:border-primary/60'
                        )}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
