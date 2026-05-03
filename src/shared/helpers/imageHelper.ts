export function validateImageFile(file: File): string | null {
    if (!file.type.startsWith('image/')) {
        return 'Selecione um arquivo de imagem valido.'
    }

    if (file.size > 2 * 1024 * 1024) {
        return 'A imagem deve ter no maximo 2MB.'
    }

    return null
}

export async function resizeImage(file: File, maxSize = 1600): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(url)

            const { width, height } = img

            if (width <= maxSize && height <= maxSize) {
                resolve(file)
                return
            }

            const ratio = Math.min(maxSize / width, maxSize / height)
            const canvas = document.createElement('canvas')
            canvas.width = Math.round(width * ratio)
            canvas.height = Math.round(height * ratio)

            const context = canvas.getContext('2d')
            if (!context) {
                reject(new Error('Nao foi possivel preparar a imagem.'))
                return
            }

            context.drawImage(img, 0, 0, canvas.width, canvas.height)

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Nao foi possivel redimensionar.'))
                        return
                    }

                    resolve(new File([blob], file.name, { type: 'image/jpeg' }))
                },
                'image/jpeg',
                0.92
            )
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Arquivo de imagem invalido.'))
        }

        img.src = url
    })
}
