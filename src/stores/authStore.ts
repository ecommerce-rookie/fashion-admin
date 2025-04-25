import Cookies from 'js-cookie'
import { create } from 'zustand'
import { User } from 'oidc-client-ts'
import { Token } from '@/enum/storage'
import authService from '@/services/auth-service'

interface AuthUser {
  accountNo?: string
  name?: string
  email?: string
  role?: string[]
  exp?: number
  sub?: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    login: () => Promise<void>
    logout: () => Promise<void>
    processLoginCallback: () => Promise<User>
    processLogoutCallback: () => Promise<void>
    isAuthenticated: () => Promise<boolean>
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const cookieState = Cookies.get(Token.JWT_TOKEN)
  const initToken = cookieState || ''
  
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(Token.JWT_TOKEN, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
        
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(Token.JWT_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
        
      reset: () =>
        set((state) => {
          Cookies.remove(Token.JWT_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
      
      // Phương thức mới cho Duende Identity Server
      login: async () => {
        await authService.login()
      },
      
      logout: async () => {
        await authService.logout()
        get().auth.reset()
      },
      
      processLoginCallback: async () => {
        const user = await authService.completeLogin()
        // Cập nhật token vào cookie và state
        if (user?.access_token) {
          get().auth.setAccessToken(user.access_token)
          
          // Map thông tin user từ OIDC sang định dạng AuthUser
          const authUser: AuthUser = {
            sub: user.profile.sub,
            name: user.profile.name,
            email: user.profile.email,
            role: user.profile.role as string[] | undefined,
            exp: user.expires_at
          }
          
          get().auth.setUser(authUser)
        }
        return user
      },
      
      processLogoutCallback: async () => {
        await authService.completeLogout()
        get().auth.reset()
      },
      
      isAuthenticated: async () => {
        // Chỉ kiểm tra sự tồn tại của JWT token trong cookies
        const jwtToken = Cookies.get(Token.JWT_TOKEN)
        return !!jwtToken
      }
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
