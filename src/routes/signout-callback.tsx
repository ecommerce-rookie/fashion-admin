import { createFileRoute } from '@tanstack/react-router'
import SignoutCallback from '@/features/auth/signout-callback'

export const Route = createFileRoute('/signout-callback')({
  component: SignoutCallback,
})
