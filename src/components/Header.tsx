import { Link } from '@tanstack/react-router'
import { ArrowBigLeft } from 'lucide-react'
export default function Header() {
  return (
    <header className="p-2 relative flex items-center gap-2 bg-white text-black justify-between">
      <nav className="absolute left-0 ">
        <div className="px-2 font-bold">
          <Link to="/">
            <ArrowBigLeft />
          </Link>
        </div>
      </nav>
      <div className='text-2xl font-bold text-center w-full'> 禹鉴天枢 (Conflux) 数据通知平台 </div>
    </header>
  )
}
