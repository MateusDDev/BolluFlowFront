import { apiClient } from '@/shared/api/client'
import { NotificationListModel } from '@/features/notifications/services/notification.model'

export function getNotifications() {
    return apiClient<NotificationListModel>('/notifications', 'GET')
}

export function markNotificationAsRead(id: number) {
    return apiClient<void>(`/notifications/${id}/read`, 'POST')
}

export function markAllNotificationsAsRead() {
    return apiClient<void>('/notifications/read-all', 'POST')
}
