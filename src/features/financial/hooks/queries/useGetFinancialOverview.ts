'use client'

import { useMemo, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { getOrderItems, getOrders } from '@/features/orders/services/order.api'
import {
    OrderItemModel,
    OrderModel,
} from '@/features/orders/services/order.model'

export type FinancialEntryType = 'income' | 'expense'
export type FinancialEntryStatus = 'paid' | 'pending'

export type FinancialEntry = {
    id: string
    description: string
    type: FinancialEntryType
    category: string
    amount: number
    date: Date
    status: FinancialEntryStatus
    isFixed: boolean
    source: 'auto-order' | 'manual' | 'auto-stock'
    reference?: string
}

export type CreateFinancialEntryInput = {
    description: string
    type: FinancialEntryType
    category: string
    amount: number
    date: string
    status: FinancialEntryStatus
    isFixed: boolean
}

export type FinancialOverviewData = {
    selectedMonth: string
    entries: FinancialEntry[]
    currentBalance: number
    forecastBalance: number
    totalIncomes: number
    totalExpenses: number
    pendingToReceive: number
    pendingToPay: number
    fixedCostsInMonth: number
}

const MANUAL_LOCAL_STORAGE_KEY = 'bolluflow-financial-manual-entries-v3'

function calculateOrderTotal(items: OrderItemModel[]) {
    return items.reduce((acc, item) => acc + item.totalPrice, 0)
}

function generateId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

function mapDeliveredOrdersToEntries(
    orders: OrderModel[],
    orderItemsMap: Record<number, OrderItemModel[]>
): FinancialEntry[] {
    return orders
        .filter((order) => order.status === 'Delivered')
        .map((order) => {
            const items = orderItemsMap[order.id] ?? []

            return {
                id: `order-${order.id}`,
                description: `Venda pedido #${order.number} - ${order.customer.name}`,
                type: 'income' as const,
                category: 'Vendas',
                amount: calculateOrderTotal(items),
                date: new Date(order.deliveryDate ?? order.createdAt),
                status: 'paid' as const,
                isFixed: false,
                source: 'auto-order' as const,
                reference: String(order.number),
            }
        })
}

function parseManualEntries(value: string | null): FinancialEntry[] {
    if (!value) return []

    try {
        const parsed = JSON.parse(value) as Array<
            Omit<FinancialEntry, 'date'> & { date: string }
        >

        return parsed.map((entry) => ({
            ...entry,
            date: new Date(entry.date),
        }))
    } catch {
        return []
    }
}

function isEntryFromMonth(entry: FinancialEntry, month: string) {
    return entry.date.toISOString().slice(0, 7) === month
}

function buildFinancialOverview(
    allEntries: FinancialEntry[],
    selectedMonth: string
): FinancialOverviewData {
    const entries = allEntries
        .filter((entry) => isEntryFromMonth(entry, selectedMonth))
        .sort((a, b) => b.date.getTime() - a.date.getTime())

    const totalIncomes = entries
        .filter((entry) => entry.type === 'income' && entry.status === 'paid')
        .reduce((acc, entry) => acc + entry.amount, 0)

    const totalExpenses = entries
        .filter((entry) => entry.type === 'expense' && entry.status === 'paid')
        .reduce((acc, entry) => acc + entry.amount, 0)

    const pendingToReceive = entries
        .filter(
            (entry) => entry.type === 'income' && entry.status === 'pending'
        )
        .reduce((acc, entry) => acc + entry.amount, 0)

    const pendingToPay = entries
        .filter(
            (entry) => entry.type === 'expense' && entry.status === 'pending'
        )
        .reduce((acc, entry) => acc + entry.amount, 0)

    const currentBalance = totalIncomes - totalExpenses
    const forecastBalance = currentBalance + pendingToReceive - pendingToPay

    const fixedCostsInMonth = entries
        .filter((entry) => entry.type === 'expense' && entry.isFixed)
        .reduce((acc, entry) => acc + entry.amount, 0)

    return {
        selectedMonth,
        entries,
        currentBalance,
        forecastBalance,
        totalIncomes,
        totalExpenses,
        pendingToReceive,
        pendingToPay,
        fixedCostsInMonth,
    }
}

export function useGetFinancialOverview(selectedMonth: string) {
    const [manualEntries, setManualEntries] = useState<FinancialEntry[]>(() => {
        if (typeof window === 'undefined') return []

        return parseManualEntries(
            window.localStorage.getItem(MANUAL_LOCAL_STORAGE_KEY)
        )
    })

    const ordersQuery = useQuery({
        queryKey: ['orders'],
        queryFn: async () => await getOrders(),
    })

    const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data])

    const orderItemsQueries = useQueries({
        queries: orders.map((order) => ({
            queryKey: ['orders', order.id, 'items'],
            queryFn: async () => await getOrderItems(order.id),
            enabled: Boolean(orders.length),
        })),
    })

    const saveEntries = (entries: FinancialEntry[]) => {
        setManualEntries(entries)
        window.localStorage.setItem(
            MANUAL_LOCAL_STORAGE_KEY,
            JSON.stringify(entries)
        )
    }

    const createEntry = (input: CreateFinancialEntryInput) => {
        const entry: FinancialEntry = {
            id: `manual-${generateId()}`,
            description: input.description.trim(),
            type: input.type,
            category: input.category.trim() || 'Despesas gerais',
            amount: input.amount,
            date: new Date(`${input.date}T12:00:00`),
            status: input.status,
            isFixed: input.isFixed,
            source: 'manual',
        }

        saveEntries([entry, ...manualEntries])
    }

    const toggleEntryStatus = (entryId: string) => {
        const updated = manualEntries.map((entry) => {
            if (entry.id !== entryId) return entry

            return {
                ...entry,
                status: entry.status === 'paid' ? 'pending' : 'paid',
            }
        })

        saveEntries(updated)
    }

    const deleteEntry = (entryId: string) => {
        saveEntries(manualEntries.filter((entry) => entry.id !== entryId))
    }

    const isLoading =
        ordersQuery.isLoading ||
        orderItemsQueries.some((query) => query.isLoading || query.isPending)

    const isError =
        ordersQuery.isError || orderItemsQueries.some((query) => query.isError)

    const data = useMemo(() => {
        const orderItemsMap = Object.fromEntries(
            orderItemsQueries.map((query, index) => [
                orders[index]?.id,
                query.data ?? [],
            ])
        ) as Record<number, OrderItemModel[]>

        const orderEntries = mapDeliveredOrdersToEntries(orders, orderItemsMap)
        return buildFinancialOverview(
            [...orderEntries, ...manualEntries],
            selectedMonth
        )
    }, [manualEntries, orderItemsQueries, orders, selectedMonth])

    return {
        isLoading,
        isError,
        data,
        createEntry,
        toggleEntryStatus,
        deleteEntry,
    }
}
