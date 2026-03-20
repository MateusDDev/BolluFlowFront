import { NextRequest, NextResponse } from 'next/server'
import {
    createId,
    getMonthKey,
    readFinanceDatabase,
    writeFinanceDatabase,
} from '@/shared/server/finance-store'

export async function POST(request: NextRequest) {
    const payload = await request.json()
    const database = await readFinanceDatabase()
    const purchasedAt =
        payload.purchasedAt ?? new Date().toISOString().slice(0, 10)
    const purchaseId = createId('purchase')

    const purchase = {
        id: purchaseId,
        itemType: payload.itemType,
        itemId: Number(payload.itemId ?? 0),
        itemName: payload.itemName,
        conversionName: payload.conversionName,
        quantity: Number(payload.quantity),
        quantityInBaseUnit: Number(payload.quantityInBaseUnit),
        totalCost: Number(payload.totalCost),
        purchasedAt,
        notes: payload.notes,
    }

    const transaction = {
        id: createId('txn_purchase'),
        type: 'expense' as const,
        sourceType:
            payload.itemType === 'ingredient'
                ? ('ingredient_purchase' as const)
                : ('supply_purchase' as const),
        description: `${payload.itemType === 'ingredient' ? 'Ingredient purchase' : 'Supply purchase'} - ${payload.itemName}`,
        amount: Number(payload.totalCost),
        eventDate: purchasedAt,
        month: getMonthKey(purchasedAt),
        notes: payload.notes,
        sourceEntityType: 'purchase' as const,
        sourceEntityId: purchaseId,
        isAutomatic: true,
        metadata: {
            conversionName: payload.conversionName,
            quantityInBaseUnit: Number(payload.quantityInBaseUnit),
        },
    }

    database.purchases.push(purchase)
    database.transactions.push(transaction)
    await writeFinanceDatabase(database)

    return NextResponse.json({ purchase, transaction }, { status: 201 })
}
