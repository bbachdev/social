import Link from "next/link";

export default function SiteHeader() {
  return (
    <nav>
      <ul className={'p-4 bg-white flex flex-row items-center mb-4 shadow-md'}>
        <div className={'mr-auto'}>
          <li>
            <Link href="/">Logo</Link>
          </li>
        </div>
        <div className={'ml-auto flex flex-row items-center space-x-4'}>
          <li>
            <Link href="/signin">Sign In</Link>
          </li>
          <li>
          <button className={'bg-brand-green-400 hover:bg-brand-green-500 text-white p-2 rounded-md'}>
            <Link href="/signup">Sign Up</Link>
          </button>
          </li>
        </div>
      </ul>
    </nav>
  )
}