import { StepBackIcon } from 'lucide-react'
import { Button } from 'ui/button'
import { useRouter } from 'next/navigation'

type BackButtonProps = {
    className?: string
}

export function BackButton({ className }: BackButtonProps) {
    const router = useRouter()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className={className}
        >
            <StepBackIcon className="text-primary" />
        </Button>
    )
}
