import { redirect } from 'next/navigation';
import { useSession, getSession } from "next-auth/react"

export default function AppLayout({children} : {children: React.ReactNode}) {
  const { data: session, status } = useSession()
  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    redirect('/signin')
  }

  return (
    <div>
      {children}
    </div>
  )
}
