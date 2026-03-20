import {
    FinancialEntry,
    FinancialEntryStatus,
    FixedAccountTemplate,
} from '@/features/financial/lib/types'
import { addMonths, compareMonth } from '@/features/financial/lib/month'

const ENTRIES_STORAGE_KEY = 'bolluflow-financial-entries-v5'
const FIXED_ACCOUNTS_STORAGE_KEY = 'bolluflow-financial-fixed-accounts-v1'
const DELETED_REFERENCES_STORAGE_KEY = 'bolluflow-financial-deleted-refs-v1'
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

type FixedAccountDeleteMode = 'until-month' | 'from-month' | 'all'

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

function parseStoredFixedAccounts(
    value: string | null
): FixedAccountTemplate[] {
    if (!value) return []

    try {
        return JSON.parse(value) as FixedAccountTemplate[]
    } catch {
        return []
    }
}

function parseDeletedReferences(value: string | null): string[] {
    if (!value) return []

    try {
        return JSON.parse(value) as string[]
    } catch {
        return []
    }
}

export function getStoredFinancialEntries() {
    if (typeof window === 'undefined') return []

    return parseStoredFinancialEntries(
        window.localStorage.getItem(ENTRIES_STORAGE_KEY)
    )
}

export function saveStoredFinancialEntries(entries: FinancialEntry[]) {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
        ENTRIES_STORAGE_KEY,
        JSON.stringify(serializeEntries(entries))
    )
    notifyFinancialEntriesUpdated()
}

export function getStoredFixedAccounts() {
    if (typeof window === 'undefined') return []

    return parseStoredFixedAccounts(
        window.localStorage.getItem(FIXED_ACCOUNTS_STORAGE_KEY)
    )
}

export function saveStoredFixedAccounts(accounts: FixedAccountTemplate[]) {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
        FIXED_ACCOUNTS_STORAGE_KEY,
        JSON.stringify(accounts)
    )
    notifyFinancialEntriesUpdated()
}

export function getDeletedFinancialReferences() {
    if (typeof window === 'undefined') return []

    return parseDeletedReferences(
        window.localStorage.getItem(DELETED_REFERENCES_STORAGE_KEY)
    )
}

function saveDeletedFinancialReferences(references: string[]) {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
        DELETED_REFERENCES_STORAGE_KEY,
        JSON.stringify(Array.from(new Set(references)))
    )
    notifyFinancialEntriesUpdated()
}

export function deleteAutomaticFinancialEntry(reference?: string) {
    if (!reference) return

    saveDeletedFinancialReferences([
        ...getDeletedFinancialReferences(),
        reference,
    ])
}

export function restoreAutomaticFinancialEntry(reference?: string) {
    if (!reference) return

    saveDeletedFinancialReferences(
        getDeletedFinancialReferences().filter((item) => item !== reference)
    )
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

    const reference = `${itemType}-${itemId}-${date ?? new Date().toISOString().slice(0, 10)}`
    const deletedReferences = getDeletedFinancialReferences()

    if (deletedReferences.includes(reference)) {
        restoreAutomaticFinancialEntry(reference)
    }

    const currentEntries = getStoredFinancialEntries().filter(
        (entry) =>
            !(entry.source === 'auto-stock' && entry.reference === reference)
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
        reference,
    }

    saveStoredFinancialEntries([nextEntry, ...currentEntries])
}

export function deleteFixedAccountTemplate(
    accountId: string,
    mode: FixedAccountDeleteMode,
    month: string
) {
    const accounts = getStoredFixedAccounts()

    const updatedAccounts = accounts.flatMap((account) => {
        if (account.id !== accountId) return [account]

        if (mode === 'all') return []

        if (mode === 'until-month') {
            const nextStartMonth = addMonths(month, 1)

            if (
                account.endMonth &&
                compareMonth(nextStartMonth, account.endMonth) > 0
            ) {
                return []
            }

            return [
                {
                    ...account,
                    startMonth: nextStartMonth,
                },
            ]
        }

        const previousMonth = addMonths(month, -1)

        if (compareMonth(previousMonth, account.startMonth) < 0) {
            return []
        }

        return [
            {
                ...account,
                endMonth: previousMonth,
            },
        ]
    })

    saveStoredFixedAccounts(updatedAccounts)
}
