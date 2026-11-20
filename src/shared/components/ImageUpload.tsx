'use client'

import { ChangeEvent, DragEvent, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Loader2, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface ImageUploadProps {
    currentImageUrl?: string | null
    onUpload: (url: string) => Promise<void> | void
    onRemove: () => void
    onFileSelect: (file: File) => Promise<string | null>
    uploading?: boolean
    error?: string | null
    placeholder?: string
}

export function ImageUpload({
    currentImageUrl,
    onUpload,
    onRemove,
    onFileSelect,
    uploading = false,
    error,
    placeholder = 'Adicionar foto',
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const openPicker = () => {
        if (!uploading) inputRef.current?.click()
    }

    const handleFile = async (file?: File) => {
        if (!file || uploading) return

        const imageUrl = await onFileSelect(file)
        if (imageUrl) await onUpload(imageUrl)

        if (inputRef.current) inputRef.current.value = ''
    }

    const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
        await handleFile(event.target.files?.[0])
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        if (!uploading) setIsDragging(true)
    }

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
        await handleFile(event.dataTransfer.files?.[0])
    }

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
            />

            <div
                role="button"
                tabIndex={uploading ? -1 : 0}
                aria-disabled={uploading}
                className={cn(
                    'group relative mx-auto flex aspect-square w-full max-w-72 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/60 text-muted-foreground transition hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    uploading && 'cursor-not-allowed',
                    currentImageUrl && 'border-solid bg-background',
                    isDragging && 'border-primary bg-primary/10'
                )}
                onClick={openPicker}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openPicker()
                    }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {currentImageUrl ? (
                    <Image
                        src={currentImageUrl}
                        alt="Foto cadastrada"
                        fill
                        sizes="388px"
                        className="object-cover"
                    />
                ) : (
                    <span className="flex flex-col items-center gap-3 px-4 text-center">
                        <Camera className="size-10" />
                        <span className="text-sm font-medium">
                            {placeholder}
                        </span>
                    </span>
                )}

                {currentImageUrl ? (
                    <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute right-2 top-2 z-10 size-8 rounded-full bg-background/90 shadow-sm hover:bg-background"
                        disabled={uploading}
                        onClick={(event) => {
                            event.stopPropagation()
                            onRemove()
                        }}
                    >
                        <X className="size-4" />
                        <span className="sr-only">Remover foto</span>
                    </Button>
                ) : null}

                {uploading ? (
                    <span className="absolute inset-0 z-20 flex items-center justify-center bg-background/70">
                        <Loader2 className="size-8 animate-spin text-primary" />
                    </span>
                ) : null}
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>
    )
}
