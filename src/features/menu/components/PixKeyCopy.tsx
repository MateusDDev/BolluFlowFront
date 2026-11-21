'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Props = {
    pixKey: string
}

export function PixKeyCopy({ pixKey }: Props) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pixKey)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="rounded-xl border border-menu-border bg-menu-card p-3 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-menu-muted">
                Chave Pix da loja
            </p>
            <div className="mt-1 flex items-center justify-between gap-3">
                <span className="min-w-0 break-all text-sm font-semibold text-menu-text">
                    {pixKey}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-menu-border px-3 py-1.5 text-xs font-medium text-menu-text transition hover:bg-menu-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-primary"
                >
                    {copied ? (
                        <Check className="size-3.5" />
                    ) : (
                        <Copy className="size-3.5" />
                    )}
                    {copied ? 'Copiada' : 'Copiar'}
                </button>
            </div>
        </div>
    )
}
