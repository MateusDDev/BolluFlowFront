import { NextRequest, NextResponse } from 'next/server'
import {
    readFinanceDatabase,
    writeFinanceDatabase,
} from '@/shared/server/finance-store'

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
    const database = await readFinanceDatabase()

    const manualTransaction = database.transactions.find(
        (item) => item.id === id && !item.deletedAt
    )
    if (manualTransaction) {
        manualTransaction.deletedAt = new Date().toISOString()
        await writeFinanceDatabase(database)
        return NextResponse.json({ deleted: true, cascade: false })
    }

    const purchaseTransaction = database.transactions.find(
        (item) =>
            item.id === id &&
            item.sourceEntityType === 'purchase' &&
            !item.deletedAt
    )

    if (purchaseTransaction?.sourceEntityId) {
        purchaseTransaction.deletedAt = new Date().toISOString()
        const purchase = database.purchases.find(
            (item) => item.id === purchaseTransaction.sourceEntityId
        )
        if (purchase) {
            purchase.deletedAt = new Date().toISOString()
        }
        await writeFinanceDatabase(database)
        return NextResponse.json({
            deleted: true,
            cascade: true,
            sourceEntityType: 'purchase',
        })
    }

    return NextResponse.json(
        { message: 'Transaction not found or cannot be deleted.' },
        { status: 404 }
    )
}
