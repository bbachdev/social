import SiteFooter from "@/components/Nav/SiteFooter";
import SiteHeader from "@/components/Nav/SiteHeader";

export default function SiteLayout({children} : {children: React.ReactNode}) {
  return (
    <div className={'h-[100dvh] bg-gradient-to-b from-white to-brand-green-100 flex flex-col'}>
      <SiteHeader/>
      <div className={'p-2'}>
        {children}
      </div>
      <div className={'mt-auto bg-brand-green-400 text-white'}>
        <SiteFooter/>
      </div>
    </div>
  )
}
