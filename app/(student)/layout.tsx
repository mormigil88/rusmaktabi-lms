import Navbar from '@/components/navbar'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  )
}
