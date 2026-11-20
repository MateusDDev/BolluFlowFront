'use client'

import { CircleHelp } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover'

type Props = {
    children: React.ReactNode
    label?: string
}

export function HelpTip({ children, label = 'O que é isso?' }: Props) {
    return (
        <Popover>
            <PopoverTrigger
                type="button"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground inline-flex align-middle"
            >
                <CircleHelp className="h-3.5 w-3.5" />
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm leading-relaxed">
                {children}
            </PopoverContent>
        </Popover>
    )
}
