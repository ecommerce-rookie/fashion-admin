import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub, IconKey } from '@tabler/icons-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import authService from '@/services/auth-service'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { login, setAccessToken, setUser } = useAuthStore(state => state.auth)
  const navigate = useNavigate()
  // Lấy tham số redirect từ URL nếu có
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Sử dụng phương thức đăng nhập trực tiếp thay vì chuyển hướng
      const tokenData = await authService.directLogin(data.email, data.password)

      // Lưu access token vào store
      setAccessToken(tokenData.access_token)

      // Nếu có thông tin user trong token (hoặc cần fetch riêng)
      // Có thể dùng jwt-decode để decode JWT token
      const authUser = {
        email: data.email,
        // Thêm các thông tin khác từ token nếu có
      }
      setUser(authUser)

      toast.success('Đăng nhập thành công!')

      // Nếu có URL redirect, chuyển hướng đến URL đó
      if (redirect) {
        navigate({ to: redirect as string, replace: true })
      } else {
        // Nếu không, chuyển hướng đến trang dashboard
        navigate({ to: '/', replace: true })
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOidcLogin = async () => {
    setIsLoading(true)
    try {
      await login()
    } catch (error) {
      console.error('OIDC login failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Login
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-2'>
          <Button
            variant='outline'
            type='button'
            disabled={isLoading}
            onClick={handleOidcLogin}
            className='w-full'
          >
            <IconKey className='h-4 w-4 mr-2' /> Single Sign-On (SSO)
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
