'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from 'ui/button'

type BackButtonProps = {
    className?: string
    href?: string
}

export function BackButton({ className, href }: BackButtonProps) {
    const router = useRouter()

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => (href ? router.push(href) : router.back())}
            className={className}
        >
            <ArrowLeft className="text-primary h-4 w-4" />
            Voltar
        </Button>
    )
}
