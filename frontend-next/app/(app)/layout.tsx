import { AppHeader } from "@/components/AppHeader"
import { AppSidebar } from "@/components/AppSidebar"
import { HealthCheckBanner } from "@/components/HealthCheckBanner"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex flex-1 flex-col overflow-hidden bg-background-app">
        <HealthCheckBanner />
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-10">{children}</div>
      </main>
    </div>
  )
}
