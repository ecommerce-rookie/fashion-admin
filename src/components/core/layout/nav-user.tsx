import {
  ChevronsUpDown,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuthor } from '@/context/author-context'

export function NavUser() {
  const { author } = useAuthor();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src={author?.avatar ?? ""} alt={author?.lastName?.[0]} />
            <AvatarFallback className='rounded-lg'>Avatar</AvatarFallback>
          </Avatar>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>{author?.firstName ? " " : ""} {author?.lastName}</span>
            <span className='truncate text-xs'>{author?.status}</span>
          </div>
          <ChevronsUpDown className='ml-auto size-4' />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
