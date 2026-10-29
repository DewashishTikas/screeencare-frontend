import AuthPage from '../_components/AuthPage'

export const metadata = {
  title: 'Sign In | ScreenCare',
  description: 'Sign in to access your saved bookings, appointment schedule, and doorstep installation status.',
}

export default function LoginPage() {
  return <AuthPage initialMode="login" />
}
