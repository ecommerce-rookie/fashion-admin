import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

// Common configuration for authentication routes
export const authRouteConfig = {
  beforeLoad: async () => {
    // Check if user is already authenticated
    const isAuthenticated = await useAuthStore.getState().auth.isAuthenticated()

    // If authenticated, redirect to dashboard
    if (isAuthenticated) {
      throw redirect({
        to: '/',
        replace: true
      })
    }
  }
}
