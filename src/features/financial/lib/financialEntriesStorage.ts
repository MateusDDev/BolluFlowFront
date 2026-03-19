import {
    FinancialEntry,
    FinancialEntryStatus,
} from '@/features/financial/lib/types'

const STORAGE_KEY = 'bolluflow-financial-manual-entries-v4'
export const FINANCIAL_STORAGE_EVENT = 'bolluflow-financial-storage-updated'

export type StoredFinancialEntry = Omit<FinancialEntry, 'date'> & {
    date: string
}

type StockPurchaseEntryInput = {
    itemType: 'ingredient' | 'supply'
    itemId: number
    itemName: string
    amount: number
    date?: string
    status?: FinancialEntryStatus
}

function notifyFinancialEntriesUpdated() {
    if (typeof window === 'undefined') return

    window.dispatchEvent(new Event(FINANCIAL_STORAGE_EVENT))
}

function serializeEntries(entries: FinancialEntry[]): StoredFinancialEntry[] {
    return entries.map((entry) => ({
        ...entry,
        date: entry.date.toISOString(),
    }))
}

export function parseStoredFinancialEntries(
    value: string | null
): FinancialEntry[] {
    if (!value) return []

    try {
        const parsed = JSON.parse(value) as StoredFinancialEntry[]

        return parsed.map((entry) => ({
            ...entry,
            date: new Date(entry.date),
        }))
    } catch {
        return []
    }
}

export function getStoredFinancialEntries() {
    if (typeof window === 'undefined') return []

    return parseStoredFinancialEntries(window.localStorage.getItem(STORAGE_KEY))
}

export function saveStoredFinancialEntries(entries: FinancialEntry[]) {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(serializeEntries(entries))
    )
    notifyFinancialEntriesUpdated()
}

export function appendStockPurchaseEntry({
    itemType,
    itemId,
    itemName,
    amount,
    date,
    status = 'paid',
}: StockPurchaseEntryInput) {
    if (typeof window === 'undefined' || amount <= 0) return

    const currentEntries = getStoredFinancialEntries().filter(
        (entry) =>
            !(
                entry.source === 'auto-stock' &&
                entry.reference ===
                    `${itemType}-${itemId}-${date ?? new Date().toISOString().slice(0, 10)}`
            )
    )

    const entryDate = new Date(
        `${date ?? new Date().toISOString().slice(0, 10)}T12:00:00`
    )

    const nextEntry: FinancialEntry = {
        id: `auto-stock-${itemType}-${itemId}-${entryDate.toISOString()}`,
        description: `Compra de ${itemType === 'ingredient' ? 'ingrediente' : 'insumo'}: ${itemName}`,
        type: 'expense',
        category: itemType === 'ingredient' ? 'Ingredientes' : 'Insumos',
        amount,
        date: entryDate,
        status,
        isFixed: false,
        source: 'auto-stock',
        reference: `${itemType}-${itemId}-${date ?? new Date().toISOString().slice(0, 10)}`,
    }

    saveStoredFinancialEntries([nextEntry, ...currentEntries])
}
