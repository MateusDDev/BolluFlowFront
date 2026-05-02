import { Store } from 'lucide-react'

type Props = {
    title: string
}

export function MenuHeader({ title }: Props) {
    return (
        <div className="overflow-hidden rounded-[28px] border border-menu-border/80 bg-menu-card/85 shadow-[0_24px_60px_hsl(var(--menu-primary-medium)/0.32)] backdrop-blur">
            <div className="px-6 py-10 text-center sm:px-10">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-menu-primary-medium text-menu-primary-dark">
                    <Store className="size-7" />
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-menu-primary-dark">
                    Nosso cardápio
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-menu-text sm:text-5xl">
                    {title}
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-menu-muted sm:text-base">
                    Escolha seus doces favoritos, monte o carrinho e envie seu
                    pedido direto por aqui.
                </p>
            </div>
        </div>
    )
}
