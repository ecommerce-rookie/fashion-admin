import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from '@/features/auth/forgot-password'
import { authRouteConfig } from '../../config/auth-route-config'

export const Route = createFileRoute('/(auth)/forgot-password')({
  beforeLoad: authRouteConfig.beforeLoad,
  component: ForgotPassword,
})
