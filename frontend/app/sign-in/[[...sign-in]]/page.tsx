import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#f5f0ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2v-5h2v5zm0-7h-2V7h2v2z"/>
            </svg>
          </div>
          <h1 className="font-poppins font-extrabold text-2xl text-charcoal">Welcome Back</h1>
          <p className="text-mid-gray font-inter text-sm mt-1">Sign in to your Hussain Healthcare account</p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
