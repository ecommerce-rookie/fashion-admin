import React from 'react'
import { cn } from '@/lib/utils'
import { Header } from './header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, ...props }: MainProps) => {
  const navigate = useNavigate()
  const { reset } = useAuthStore((state) => state.auth)


  const handleSignOut = async () => {
    try {
      // Reset auth state locally (clear tokens and user data)
      reset()

      // Show a success message
      toast.success('Signed out successfully.')

      // Navigate directly to the login page
      navigate({ to: '/sign-in', replace: true })
    } catch {
      toast.error('Error signing out. Please try again.')
    }
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <Button onClick={handleSignOut}>
            <LogOut />
            Log out
          </Button>
        </div>
      </Header>
      <main
        className={cn(
          'peer-[.header-fixed]/header:mt-16',
          'px-4 py-6',
          fixed && 'fixed-main flex grow flex-col overflow-hidden'
        )}
        {...props}
      />
    </>
  )
}

Main.displayName = 'Main'
