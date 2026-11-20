import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

type Props = {
    icon: LucideIcon
    title: string
    description: string
    example?: string
    action?: ReactNode
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    example,
    action,
}: Props) {
    return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>
            {example && (
                <p className="text-muted-foreground text-xs italic">
                    {example}
                </p>
            )}
            {action && (
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {action}
                </div>
            )}
        </div>
    )
}
