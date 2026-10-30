export const metadata = {
  title: 'Technician Portal | ScreenCare',
  description: 'Technician assigned jobs and installation checklist portal',
}

export default function TechnicianLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f3f4f8] text-gray-900 font-sans flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-white shadow-xl flex flex-col relative pb-20">
        {children}
      </div>
    </div>
  )
}

