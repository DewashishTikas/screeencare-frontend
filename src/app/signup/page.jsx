import AuthPage from '../_components/AuthPage'

export const metadata = {
  title: 'Create Account | ScreenCare',
  description: 'Create an account to keep every booking, appointment update, and installation detail in one secure place.',
}

export default function SignupPage() {
  return <AuthPage initialMode="signup" />
}
