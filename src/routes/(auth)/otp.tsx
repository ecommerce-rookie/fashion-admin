import { createFileRoute } from '@tanstack/react-router'
import Otp from '@/features/auth/otp'
import { authRouteConfig } from '../../config/auth-route-config'

export const Route = createFileRoute('/(auth)/otp')({
  beforeLoad: authRouteConfig.beforeLoad,
  component: Otp,
})
