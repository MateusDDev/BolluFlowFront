'use client'

import { useState } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { resizeImage, validateImageFile } from '@/shared/helpers/imageHelper'

interface UseImageUploadOptions {
    bucket: string
    prefix?: string
}

export function useImageUpload({
    bucket,
    prefix = 'file',
}: UseImageUploadOptions) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const upload = async (file: File): Promise<string | null> => {
        setError(null)

        const validationError = validateImageFile(file)
        if (validationError) {
            setError(validationError)
            return null
        }

        setUploading(true)

        try {
            const resized = await resizeImage(file)
            const ext =
                resized.type === 'image/jpeg'
                    ? 'jpg'
                    : (resized.name.split('.').pop() ?? 'jpg')
            const fileName = `${prefix}-${Date.now()}.${ext}`

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, resized, { upsert: true })

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName)

            return data.publicUrl
        } catch {
            setError('Nao foi possivel fazer o upload da imagem.')
            return null
        } finally {
            setUploading(false)
        }
    }

    const remove = async (imageUrl: string): Promise<void> => {
        setError(null)

        const fileName = imageUrl.split('/').pop()
        if (!fileName) return

        const { error: removeError } = await supabase.storage
            .from(bucket)
            .remove([fileName])

        if (removeError) {
            setError('Nao foi possivel remover a imagem.')
            throw removeError
        }
    }

    return { upload, remove, uploading, error }
}
