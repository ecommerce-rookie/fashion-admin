import { createFileRoute } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'
import { authRouteConfig } from '../../config/auth-route-config'

export const Route = createFileRoute('/(auth)/sign-up')({
  beforeLoad: authRouteConfig.beforeLoad,
  component: SignUp,
})
