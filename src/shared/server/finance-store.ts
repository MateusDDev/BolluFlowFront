import { promises as fs } from 'node:fs'
import path from 'node:path'

export type TransactionType = 'income' | 'expense'
export type TransactionSourceType =
    | 'manual'
    | 'sale'
    | 'ingredient_purchase'
    | 'supply_purchase'
    | 'fixed_cost'

export type SourceEntityType = 'sale' | 'purchase' | 'fixed_cost' | 'manual'

export type FinancialTransaction = {
    id: string
    type: TransactionType
    sourceType: TransactionSourceType
    description: string
    amount: number
    eventDate: string
    month: string
    notes?: string
    sourceEntityType: SourceEntityType
    sourceEntityId?: string
    isAutomatic: boolean
    metadata?: Record<string, unknown>
    deletedAt?: string | null
}

export type FixedCost = {
    id: string
    name: string
    amount: number
    startMonth: string
    endMonth?: string | null
    notes?: string
    deletedAt?: string | null
    createdAt: string
    updatedAt: string
}

export type InventoryPurchase = {
    id: string
    itemType: 'ingredient' | 'supply'
    itemId: number
    itemName: string
    conversionName: string
    quantity: number
    quantityInBaseUnit: number
    totalCost: number
    purchasedAt: string
    notes?: string
    deletedAt?: string | null
}

export type FinanceDatabase = {
    transactions: FinancialTransaction[]
    fixedCosts: FixedCost[]
    purchases: InventoryPurchase[]
}

const dataFilePath = path.join(process.cwd(), 'src/shared/server/finance-db.json')

const seedDatabase: FinanceDatabase = {
    transactions: [
        {
            id: 'txn_manual_seed_1',
            type: 'income',
            sourceType: 'manual',
            description: 'Manual income - catering deposit',
            amount: 420,
            eventDate: '2026-03-03',
            month: '2026-03',
            sourceEntityType: 'manual',
            isAutomatic: false,
        },
        {
            id: 'txn_sale_seed_1',
            type: 'income',
            sourceType: 'sale',
            description: 'Sale income - weekend orders',
            amount: 1380,
            eventDate: '2026-03-12',
            month: '2026-03',
            sourceEntityType: 'sale',
            sourceEntityId: 'sale_1001',
            isAutomatic: true,
        },
        {
            id: 'txn_purchase_seed_1',
            type: 'expense',
            sourceType: 'ingredient_purchase',
            description: 'Ingredient purchase - premium chocolate',
            amount: 280,
            eventDate: '2026-03-08',
            month: '2026-03',
            sourceEntityType: 'purchase',
            sourceEntityId: 'purchase_seed_1',
            isAutomatic: true,
        },
    ],
    fixedCosts: [
        {
            id: 'fixed_rent_1',
            name: 'Kitchen rent',
            amount: 1200,
            startMonth: '2026-01',
            notes: 'Main production kitchen',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
            id: 'fixed_power_1',
            name: 'Electricity',
            amount: 340,
            startMonth: '2026-02',
            notes: 'Estimated monthly average',
            createdAt: '2026-02-01T00:00:00.000Z',
            updatedAt: '2026-02-01T00:00:00.000Z',
        },
    ],
    purchases: [
        {
            id: 'purchase_seed_1',
            itemType: 'ingredient',
            itemId: 1,
            itemName: 'Premium chocolate',
            conversionName: '5 kg pack',
            quantity: 1,
            quantityInBaseUnit: 5,
            totalCost: 280,
            purchasedAt: '2026-03-08',
        },
    ],
}

async function ensureDatabase() {
    try {
        await fs.access(dataFilePath)
    } catch {
        await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
        await fs.writeFile(dataFilePath, JSON.stringify(seedDatabase, null, 2))
    }
}

export async function readFinanceDatabase(): Promise<FinanceDatabase> {
    await ensureDatabase()
    const content = await fs.readFile(dataFilePath, 'utf8')
    return JSON.parse(content) as FinanceDatabase
}

export async function writeFinanceDatabase(database: FinanceDatabase) {
    await fs.writeFile(dataFilePath, JSON.stringify(database, null, 2))
}

export function getMonthKey(value: string | Date) {
    const date = typeof value === 'string' ? new Date(value) : value
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export function createId(prefix: string) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function listMonthsBetween(startMonth: string, endMonth: string) {
    const months: string[] = []
    let [year, month] = startMonth.split('-').map(Number)
    const [endYear, endMonthNumber] = endMonth.split('-').map(Number)

    while (year < endYear || (year === endYear && month <= endMonthNumber)) {
        months.push(`${year}-${String(month).padStart(2, '0')}`)
        month += 1
        if (month > 12) {
            month = 1
            year += 1
        }
    }

    return months
}

export function isFixedCostActiveForMonth(fixedCost: FixedCost, month: string) {
    const notDeleted = !fixedCost.deletedAt
    const startsBeforeOrAtMonth = fixedCost.startMonth <= month
    const endsAfterMonth = !fixedCost.endMonth || fixedCost.endMonth >= month

    return notDeleted && startsBeforeOrAtMonth && endsAfterMonth
}

export function buildFixedCostTransactions(
    fixedCosts: FixedCost[],
    month: string
): FinancialTransaction[] {
    return fixedCosts
        .filter((fixedCost) => isFixedCostActiveForMonth(fixedCost, month))
        .map((fixedCost) => ({
            id: `virtual_fixed_${fixedCost.id}_${month}`,
            type: 'expense' as const,
            sourceType: 'fixed_cost' as const,
            description: fixedCost.name,
            amount: fixedCost.amount,
            eventDate: `${month}-01`,
            month,
            sourceEntityType: 'fixed_cost' as const,
            sourceEntityId: fixedCost.id,
            isAutomatic: true,
            metadata: {
                recurring: true,
            },
        }))
}
