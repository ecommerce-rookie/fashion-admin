import { createFileRoute } from '@tanstack/react-router'
import SigninCallback from '@/features/auth/signin-callback'

export const Route = createFileRoute('/signin-callback')({
    component: SigninCallback,
})