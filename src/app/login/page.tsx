"use client"

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setMessage({ type: 'success', text: 'Check your email for the confirmation link.' })
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.refresh()
                router.push('/dashboard')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred'
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* Left Side - Image/Pattern */}
            <div className="hidden lg:flex relative bg-purple-900 overflow-hidden items-center justify-center p-12">
                <img
                    src="/images/login.jpg"
                    alt="Knitting needles and wool"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 mix-blend-multiply"></div>
                <div className="relative z-10 text-white max-w-lg text-center">
                    <div className="mb-8 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto border border-white/20 shadow-2xl">
                        <ShoppingBag className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 font-outfit tracking-tight">Welcome to Aranya</h1>
                    <p className="text-purple-100 text-xl leading-relaxed font-light">
                        The exclusive pop-up market for wool artisans. Create your store, showcase your collection, and sell for a limited time.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center p-8 sm:p-20 lg:p-24 bg-white relative">
                <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="w-full max-w-md mx-auto">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                        <p className="text-gray-500">
                            {isSignUp ? 'Enter your details to start selling.' : 'Please enter your details to sign in.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="you@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        {message && (
                            <div
                                className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                                    }`}
                            >
                                {message.type === 'success' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : isSignUp ? (
                                'Create Account'
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-purple-600 hover:text-purple-800 font-semibold hover:underline"
                        >
                            {isSignUp ? 'Log In' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
