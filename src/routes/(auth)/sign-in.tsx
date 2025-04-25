import { createFileRoute } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'
import { authRouteConfig } from '../../config/auth-route-config'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: authRouteConfig.beforeLoad,
  component: SignIn,
})
