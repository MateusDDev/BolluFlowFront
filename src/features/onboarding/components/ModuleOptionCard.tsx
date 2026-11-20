import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { AppModuleInfo } from '@/shared/modules/modules'

type Props = {
    module: AppModuleInfo
    selected: boolean
    onToggle: () => void
}

export function ModuleOptionCard({ module, selected, onToggle }: Props) {
    const Icon = selected ? CheckCircle2 : Circle

    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick={onToggle}
            className={cn(
                'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                selected
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
            )}
        >
            <Icon
                className={cn(
                    'mt-0.5 h-5 w-5 shrink-0',
                    selected ? 'text-primary' : 'text-muted-foreground'
                )}
            />
            <span className="space-y-1">
                <span className="block font-medium">{module.title}</span>
                <span className="text-muted-foreground block text-sm">
                    {module.description}
                </span>
            </span>
        </button>
    )
}
