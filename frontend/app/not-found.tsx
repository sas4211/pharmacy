import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-7xl">💊</div>
      <h1 className="font-poppins font-extrabold text-4xl text-brand-blue">404</h1>
      <p className="font-inter text-mid-gray text-lg">Oops — this page doesn't exist</p>
      <Link
        href="/"
        className="mt-2 px-6 py-3 rounded-xl text-white font-poppins font-bold text-sm"
        style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
      >Go Back Home</Link>
    </div>
  )
}
