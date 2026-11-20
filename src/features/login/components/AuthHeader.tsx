import { GalleryVerticalEnd } from 'lucide-react'

type Props = {
    subtitle: string
}

export function AuthHeader({ subtitle }: Props) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
            </div>

            <h1 className="text-xl font-bold">BolluFlow</h1>
            <p className="text-center text-sm">{subtitle}</p>
        </div>
    )
}
