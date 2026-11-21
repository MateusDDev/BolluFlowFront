type AddressParts = {
    street: string
    number: number | string
    neighborhood: string
    complement?: string | null
}

export function formatAddress(address: AddressParts): string {
    const base = `${address.street}, ${address.number} - ${address.neighborhood}`

    return address.complement ? `${base} (${address.complement})` : base
}
