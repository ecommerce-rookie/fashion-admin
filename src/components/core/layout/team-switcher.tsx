
import { ChevronsUpDown } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import logo from '@/assets/logo.svg'

export function TeamSwitcher() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
            <img src={logo} alt="" />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>
              Fashion Admin
            </span>
            <span className='truncate text-xs'>Enterprise</span>
          </div>
          <ChevronsUpDown className='ml-auto' />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
