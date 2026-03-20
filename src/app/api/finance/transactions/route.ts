import { NextRequest, NextResponse } from 'next/server'
import { getExpandedTransactions } from '@/app/api/finance/utils'
import {
    createId,
    getMonthKey,
    readFinanceDatabase,
    writeFinanceDatabase,
} from '@/shared/server/finance-store'

export async function GET(request: NextRequest) {
    const month = request.nextUrl.searchParams.get('month') ?? undefined
    const transactions = await getExpandedTransactions(month)

    return NextResponse.json(
        [...transactions].sort((a, b) => b.eventDate.localeCompare(a.eventDate))
    )
}

export async function POST(request: NextRequest) {
    const payload = await request.json()
    const database = await readFinanceDatabase()
    const eventDate = payload.eventDate ?? new Date().toISOString().slice(0, 10)

    const transaction = {
        id: createId('txn_manual'),
        type: payload.type,
        sourceType: 'manual' as const,
        description: payload.description,
        amount: Number(payload.amount),
        eventDate,
        month: getMonthKey(eventDate),
        notes: payload.notes,
        sourceEntityType: 'manual' as const,
        isAutomatic: false,
    }

    database.transactions.push(transaction)
    await writeFinanceDatabase(database)

    return NextResponse.json(transaction, { status: 201 })
}
