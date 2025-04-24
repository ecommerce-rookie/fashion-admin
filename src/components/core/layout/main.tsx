import React from 'react'
import { cn } from '@/lib/utils'
import { Header } from './header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
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
