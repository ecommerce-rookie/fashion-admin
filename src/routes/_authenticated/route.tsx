import Cookies from 'js-cookie'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { CommandMenu } from '@/components/command-menu'
import { AppSidebar } from '@/components/core/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { useAuthStore } from '@/stores/authStore'
import { AuthorProvider } from '@/context/author-context'

export const Route = createFileRoute('/_authenticated')({
  // Thêm kiểm tra xác thực trước khi vào các trang yêu cầu đăng nhập
  beforeLoad: async () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const isAuthenticated = await useAuthStore.getState().auth.isAuthenticated()

    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
      // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
      const returnUrl = window.location.pathname
      throw redirect({
        to: '/sign-in',
        search: { redirect: returnUrl },
        replace: true
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  return (
    <AuthorProvider>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <CommandMenu />
          <div
            id='content'
            className={cn(
              'ml-auto w-full max-w-full',
              'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              'sm:transition-[width] sm:duration-200 sm:ease-linear',
              'flex h-svh flex-col',
              'group-data-[scroll-locked=1]/body:h-full',
              'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
            )}
          >
            <Outlet />
          </div>
        </SidebarProvider>
      </SearchProvider>
    </AuthorProvider>
  )
}
