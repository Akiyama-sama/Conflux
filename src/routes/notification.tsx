import { createFileRoute } from '@tanstack/react-router'
import Notification from '@/feature/notification.tsx'

export const Route = createFileRoute('/notification')({
  component: Notification,
})


