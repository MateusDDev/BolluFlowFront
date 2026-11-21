export function buildWhatsappUrl(whatsapp: string, message: string): string {
    const phone = whatsapp.replace(/\D/g, '')
    const fullPhone = phone.startsWith('55') ? phone : `55${phone}`

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`
}
