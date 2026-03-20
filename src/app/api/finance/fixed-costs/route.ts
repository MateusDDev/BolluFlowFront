import { NextRequest, NextResponse } from 'next/server'
import {
    createId,
    readFinanceDatabase,
    writeFinanceDatabase,
} from '@/shared/server/finance-store'

export async function GET() {
    const database = await readFinanceDatabase()
    return NextResponse.json(
        database.fixedCosts.filter((item) => !item.deletedAt)
    )
}

export async function POST(request: NextRequest) {
    const payload = await request.json()
    const database = await readFinanceDatabase()
    const now = new Date().toISOString()
    const fixedCost = {
        id: createId('fixed'),
        name: payload.name,
        amount: Number(payload.amount),
        startMonth: payload.startMonth,
        endMonth: payload.endMonth || null,
        notes: payload.notes,
        createdAt: now,
        updatedAt: now,
    }

    database.fixedCosts.push(fixedCost)
    await writeFinanceDatabase(database)

    return NextResponse.json(fixedCost, { status: 201 })
}
