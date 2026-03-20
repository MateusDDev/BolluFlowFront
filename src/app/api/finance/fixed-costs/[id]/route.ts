import { NextRequest, NextResponse } from 'next/server'
import {
    readFinanceDatabase,
    writeFinanceDatabase,
} from '@/shared/server/finance-store'

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
    const payload = await request.json()
    const database = await readFinanceDatabase()
    const fixedCost = database.fixedCosts.find(
        (item) => item.id === id && !item.deletedAt
    )

    if (!fixedCost) {
        return NextResponse.json(
            { message: 'Fixed cost not found.' },
            { status: 404 }
        )
    }

    fixedCost.name = payload.name
    fixedCost.amount = Number(payload.amount)
    fixedCost.startMonth = payload.startMonth
    fixedCost.endMonth = payload.endMonth || null
    fixedCost.notes = payload.notes
    fixedCost.updatedAt = new Date().toISOString()

    await writeFinanceDatabase(database)

    return NextResponse.json(fixedCost)
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
    const mode = request.nextUrl.searchParams.get('mode') ?? 'permanent'
    const month = request.nextUrl.searchParams.get('month')
    const database = await readFinanceDatabase()
    const fixedCost = database.fixedCosts.find(
        (item) => item.id === id && !item.deletedAt
    )

    if (!fixedCost) {
        return NextResponse.json(
            { message: 'Fixed cost not found.' },
            { status: 404 }
        )
    }

    if (mode === 'until-this-month' && month) {
        fixedCost.endMonth = month
    } else if (mode === 'from-this-month-forward' && month) {
        fixedCost.endMonth =
            month < fixedCost.startMonth ? fixedCost.startMonth : month
    } else {
        fixedCost.deletedAt = new Date().toISOString()
    }

    fixedCost.updatedAt = new Date().toISOString()
    await writeFinanceDatabase(database)

    return NextResponse.json({ deleted: true, mode, month: month ?? null })
}
