'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { getOrderItems, getOrders } from '@/features/orders/services/order.api'
import {
    OrderItemModel,
    OrderModel,
} from '@/features/orders/services/order.model'
import {
    deleteAutomaticFinancialEntry,
    deleteFixedAccountTemplate,
    FINANCIAL_STORAGE_EVENT,
    getDeletedFinancialReferences,
    getStoredFinancialEntries,
    getStoredFixedAccounts,
    saveStoredFinancialEntries,
    saveStoredFixedAccounts,
} from '@/features/financial/lib/financialEntriesStorage'
import {
    compareMonth,
    getMonthFromDate,
    getMonthsBetween,
} from '@/features/financial/lib/month'
import {
    CreateFinancialEntryInput,
    FinancialEntry,
    FixedAccountTemplate,
} from '@/features/financial/lib/types'

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
    recentEntries: FinancialEntry[]
}

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

function buildFixedAccountEntries(
    accounts: FixedAccountTemplate[],
    selectedMonth: string
): FinancialEntry[] {
    return accounts.flatMap((account) => {
        const finalMonth = account.endMonth ?? selectedMonth

        if (compareMonth(account.startMonth, selectedMonth) > 0) return []

        return getMonthsBetween(account.startMonth, finalMonth)
            .filter((month) => compareMonth(month, selectedMonth) <= 0)
            .map((month) => ({
                id: `fixed-${account.id}-${month}`,
                description: account.description,
                type: 'expense' as const,
                category: account.category,
                amount: account.amount,
                date: new Date(`${month}-01T12:00:00`),
                status:
                    month === selectedMonth ? account.defaultStatus : 'paid',
                isFixed: true,
                source: 'auto-fixed' as const,
                reference: `${account.id}-${month}`,
            }))
    })
}

function buildFinancialOverview(
    allEntries: FinancialEntry[],
    selectedMonth: string
): FinancialOverviewData {
    const monthEntries = allEntries
        .filter((entry) => getMonthFromDate(entry.date) === selectedMonth)
        .sort((a, b) => b.date.getTime() - a.date.getTime())

    const timelineEntries = allEntries.filter(
        (entry) =>
            compareMonth(getMonthFromDate(entry.date), selectedMonth) <= 0
    )

    const totalIncomes = monthEntries
        .filter((entry) => entry.type === 'income' && entry.status === 'paid')
        .reduce((acc, entry) => acc + entry.amount, 0)

    const totalExpenses = monthEntries
        .filter((entry) => entry.type === 'expense' && entry.status === 'paid')
        .reduce((acc, entry) => acc + entry.amount, 0)

    const pendingToReceive = monthEntries
        .filter(
            (entry) => entry.type === 'income' && entry.status === 'pending'
        )
        .reduce((acc, entry) => acc + entry.amount, 0)

    const pendingToPay = monthEntries
        .filter(
            (entry) => entry.type === 'expense' && entry.status === 'pending'
        )
        .reduce((acc, entry) => acc + entry.amount, 0)

    const currentBalance = timelineEntries.reduce((acc, entry) => {
        if (entry.status !== 'paid') return acc
        return acc + (entry.type === 'income' ? entry.amount : -entry.amount)
    }, 0)

    const forecastBalance = timelineEntries.reduce((acc, entry) => {
        return acc + (entry.type === 'income' ? entry.amount : -entry.amount)
    }, 0)

    const fixedCostsInMonth = monthEntries
        .filter((entry) => entry.type === 'expense' && entry.isFixed)
        .reduce((acc, entry) => acc + entry.amount, 0)

    return {
        selectedMonth,
        entries: monthEntries,
        currentBalance,
        forecastBalance,
        totalIncomes,
        totalExpenses,
        pendingToReceive,
        pendingToPay,
        fixedCostsInMonth,
        recentEntries: monthEntries.slice(0, 5),
    }
}

export function useGetFinancialOverview(selectedMonth: string) {
    const [storedEntries, setStoredEntries] = useState<FinancialEntry[]>(() => {
        if (typeof window === 'undefined') return []
        return getStoredFinancialEntries()
    })
    const [fixedAccounts, setFixedAccounts] = useState<FixedAccountTemplate[]>(
        () => {
            if (typeof window === 'undefined') return []
            return getStoredFixedAccounts()
        }
    )

    useEffect(() => {
        const syncState = () => {
            setStoredEntries(getStoredFinancialEntries())
            setFixedAccounts(getStoredFixedAccounts())
        }

        window.addEventListener(FINANCIAL_STORAGE_EVENT, syncState)
        window.addEventListener('storage', syncState)

        return () => {
            window.removeEventListener(FINANCIAL_STORAGE_EVENT, syncState)
            window.removeEventListener('storage', syncState)
        }
    }, [])

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
        setStoredEntries(entries)
        saveStoredFinancialEntries(entries)
    }

    const saveFixedAccounts = (accounts: FixedAccountTemplate[]) => {
        setFixedAccounts(accounts)
        saveStoredFixedAccounts(accounts)
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

        saveEntries([entry, ...storedEntries])
    }

    const updateEntry = (entryId: string, input: CreateFinancialEntryInput) => {
        const updated = storedEntries.map((entry) => {
            if (entry.id !== entryId) return entry

            return {
                ...entry,
                description: input.description.trim(),
                type: input.type,
                category: input.category.trim() || 'Despesas gerais',
                amount: input.amount,
                date: new Date(`${input.date}T12:00:00`),
                status: input.status,
                isFixed: input.isFixed,
            }
        })

        saveEntries(updated)
    }

    const toggleEntryStatus = (entryId: string) => {
        const updated = storedEntries.map((entry) => {
            if (entry.id !== entryId) return entry

            return {
                ...entry,
                status: (entry.status === 'paid'
                    ? 'pending'
                    : 'paid') as FinancialEntry['status'],
            }
        })

        saveEntries(updated)
    }

    const deleteEntry = (entryId: string) => {
        const entry = storedEntries.find((item) => item.id === entryId)

        if (entry?.source === 'auto-stock') {
            deleteAutomaticFinancialEntry(entry.reference)
        }

        saveEntries(storedEntries.filter((item) => item.id !== entryId))
    }

    const createFixedAccount = (input: CreateFinancialEntryInput) => {
        const nextAccount: FixedAccountTemplate = {
            id: `fixed-account-${generateId()}`,
            description: input.description.trim(),
            category: input.category.trim() || 'Contas fixas',
            amount: input.amount,
            startMonth: input.date.slice(0, 7),
            defaultStatus: input.status,
            endMonth: null,
        }

        saveFixedAccounts([nextAccount, ...fixedAccounts])
    }

    const updateFixedAccount = (
        accountId: string,
        input: CreateFinancialEntryInput
    ) => {
        const updated = fixedAccounts.map((account) => {
            if (account.id !== accountId) return account

            return {
                ...account,
                description: input.description.trim(),
                category: input.category.trim() || 'Contas fixas',
                amount: input.amount,
                startMonth: input.date.slice(0, 7),
                defaultStatus: input.status,
            }
        })

        saveFixedAccounts(updated)
    }

    const deleteFixedAccount = (
        accountId: string,
        mode: 'until-month' | 'from-month' | 'all'
    ) => {
        deleteFixedAccountTemplate(accountId, mode, selectedMonth)
        setFixedAccounts(getStoredFixedAccounts())
    }

    const isLoading =
        ordersQuery.isLoading ||
        orderItemsQueries.some((query) => query.isLoading || query.isPending)

    const isError =
        ordersQuery.isError || orderItemsQueries.some((query) => query.isError)

    const data = useMemo(() => {
        const deletedReferences = getDeletedFinancialReferences()
        const orderItemsMap = Object.fromEntries(
            orderItemsQueries.map((query, index) => [
                orders[index]?.id,
                query.data ?? [],
            ])
        ) as Record<number, OrderItemModel[]>

        const orderEntries = mapDeliveredOrdersToEntries(orders, orderItemsMap)
        const generatedFixedEntries = buildFixedAccountEntries(
            fixedAccounts,
            selectedMonth
        )
        const visibleStoredEntries = storedEntries.filter(
            (entry) =>
                !entry.reference || !deletedReferences.includes(entry.reference)
        )

        return buildFinancialOverview(
            [
                ...orderEntries,
                ...visibleStoredEntries,
                ...generatedFixedEntries,
            ],
            selectedMonth
        )
    }, [fixedAccounts, orderItemsQueries, orders, selectedMonth, storedEntries])

    return {
        isLoading,
        isError,
        data,
        fixedAccounts,
        createEntry,
        updateEntry,
        toggleEntryStatus,
        deleteEntry,
        createFixedAccount,
        updateFixedAccount,
        deleteFixedAccount,
    }
}
