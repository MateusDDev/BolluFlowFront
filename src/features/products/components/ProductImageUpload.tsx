'use client'

import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { ImageUpload } from '@/shared/components/ImageUpload'
import { useImageUpload } from '@/shared/hooks/useImageUpload'
import { useUpdateProductImage } from '@/features/products/details/hooks/mutations/useUpdateProductImage'

interface ProductImageUploadProps {
    productId: number
    imageUrl?: string | null
}

export function ProductImageUpload({
    productId,
    imageUrl,
}: ProductImageUploadProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!
    const { upload, remove, uploading, error } = useImageUpload({
        bucket,
        prefix: 'product',
    })
    const {
        mutateAsync: saveProductImage,
        isPending,
        error: saveError,
    } = useUpdateProductImage(productId)

    const handleUpload = async (url: string) => {
        try {
            await saveProductImage(url)
        } catch {
            await remove(url)
        }
    }

    const handleRemove = async () => {
        if (!imageUrl) return

        try {
            await remove(imageUrl)
            await saveProductImage(null)
            setIsConfirmOpen(false)
        } catch {
            // The hook/mutation states already expose the user-facing message.
        }
    }

    return (
        <>
            <ImageUpload
                currentImageUrl={imageUrl}
                onFileSelect={upload}
                onUpload={handleUpload}
                onRemove={() => setIsConfirmOpen(true)}
                uploading={uploading || isPending}
                error={error ?? saveError?.message ?? null}
                placeholder="Adicionar foto do produto"
            />

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Remover foto do produto?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover a foto deste produto?
                            Essa acao tambem remove o arquivo do armazenamento.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending}
                            onClick={(event) => {
                                event.preventDefault()
                                void handleRemove()
                            }}
                        >
                            {isPending ? 'Removendo...' : 'Remover foto'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
