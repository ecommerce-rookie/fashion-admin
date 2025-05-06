import {
  IconCategory,
  IconLayoutDashboard,
  IconPackages,
  IconShip,
  IconUsers,
} from '@tabler/icons-react'
import { type SidebarData } from '@/components/core/layout/types'
import logo from '@/assets/logo.svg'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Fashion Admin',
      logo: () => <img src={logo} alt="Team Logo" />,
      plan: 'Vite + ShadcnUI',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
        {
          title: 'Products',
          url: '/products',
          icon: IconPackages,
        },
        {
          title: 'Categories',
          url: '/categories',
          icon: IconCategory,
        },
        {
          title: 'Orders',
          url: '/orders',
          icon: IconShip,
        },
      ],
    },
  ],
}
