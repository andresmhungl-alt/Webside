import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingBag, Star, TrendingUp, Clock } from 'lucide-react'

// Placeholder for the generated image - assuming it will be saved as 'lavender_wool_hero.png' in public folder
// If not automatically there, we'll need to move it. For now, referencing it.

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-purple-200">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-2xl tracking-tight">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-purple-700" />
            </div>
            <span className="font-outfit">Aranya</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden md:block px-5 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors">
              Log In
            </Link>
            <Link href="/login" className="px-6 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg hover:shadow-purple-200 transition-all transform hover:-translate-y-0.5">
              Start Selling
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold tracking-wide border border-purple-100">
              <Star className="w-4 h-4 fill-purple-700" />
              <span>The Premier Pop-Up Wool Market</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] font-outfit">
              Weave Your Story.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 animate-gradient">
                Share Your Wool.
              </span>
            </h1>
            <p className="max-w-lg text-lg text-gray-600 leading-relaxed">
              Aranya connects artisans with wool lovers through exclusive, time-limited pop-up shops. Launch your collection in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login" className="px-8 py-4 text-lg font-semibold bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group">
                Create Store <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-8 py-4 text-lg font-semibold bg-white text-gray-900 border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm">
                Explore
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    User
                  </div>
                ))}
              </div>
              <p>Joined by 1,000+ artisans</p>
            </div>
          </div>

          <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 group">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent z-10 pointer-events-none"></div>
            {/* Local Image: Person knitting/wearing wool, cozy aesthetic */}
            <Image
              src="/images/hero.jpg"
              alt="Cozy wool knitting"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />

            <div className="absolute bottom-8 left-8 right-8 z-20 hidden md:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">Featured Collection</p>
                  <p className="text-purple-100 text-sm">Handwoven Alpaca Series</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                  </div>
                  <span className="text-white text-xs font-medium">+120 others viewing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Aranya?</h2>
              <p className="text-gray-600 text-lg">Designed for simplicity and elegance. Focus on your craft, we handle the platform.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: TrendingUp, title: 'Instant Setup', desc: 'From signup to sales in minutes. No complex configuration required.' },
                { icon: Clock, title: 'Ephemeral Markets', desc: 'Create urgency with time-limited stores. Perfect for seasonal drops.' },
                { icon: ShoppingBag, title: 'Curated Experience', desc: 'A beautiful, distraction-free environment that highlights your products.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
            <span>Aranya</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Aranya Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
