export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-start justify-center bg-muted">
      <div className="w-full max-w-[430px] min-h-screen bg-background shadow-2xl relative">
        {children}
      </div>
    </div>
  )
}
