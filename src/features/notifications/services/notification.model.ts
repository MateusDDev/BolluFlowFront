export type NotificationType = 'MenuOrderCreated'

export type NotificationModel = {
    id: number
    type: NotificationType
    title: string
    message: string
    referenceId: number | null
    createdAt: string
    isRead: boolean
}

export type NotificationListModel = {
    unreadCount: number
    items: NotificationModel[]
}
