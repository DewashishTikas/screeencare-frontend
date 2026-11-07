import AdminSidebar from './_components/AdminSidebar'

export const metadata = {
  title: 'Apexguard Admin',
  description: 'Apexguard operations dashboard',
}

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

