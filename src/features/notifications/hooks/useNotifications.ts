import { useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from '@/features/notifications/services/notification.api'

const NOTIFICATIONS_QUERY_KEY = ['notifications']
const POLLING_INTERVAL_MS = 30_000

export function useNotifications() {
    const queryClient = useQueryClient()
    const previousUnread = useRef<number | null>(null)

    const query = useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEY,
        queryFn: getNotifications,
        refetchInterval: POLLING_INTERVAL_MS,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
    })

    const unreadCount = query.data?.unreadCount ?? 0

    useEffect(() => {
        if (
            previousUnread.current !== null &&
            unreadCount > previousUnread.current
        ) {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        }

        previousUnread.current = unreadCount
    }, [unreadCount, queryClient])

    return query
}

export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: NOTIFICATIONS_QUERY_KEY,
            }),
    })
}

export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: NOTIFICATIONS_QUERY_KEY,
            }),
    })
}
