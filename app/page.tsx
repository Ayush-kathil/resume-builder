'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F2F1ED] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-[#F2F1ED]">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between p-6 md:px-12 lg:px-24">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex gap-[2px]">
            <div className="w-1.5 h-4 bg-[#1a1a1a] rounded-full"></div>
            <div className="w-1.5 h-6 bg-[#1a1a1a] rounded-full translate-y-[-4px]"></div>
            <div className="w-1.5 h-4 bg-[#1a1a1a] rounded-full"></div>
          </div>
          <span className="font-playfair text-xl tracking-tight font-medium">resume maker</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/login" className="hover:opacity-70 transition-opacity">Log in</Link>
          <Link href="/signup" className="bg-[#1a1a1a] text-[#F2F1ED] px-5 py-2.5 rounded-full hover:bg-black transition-colors">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center pt-20 pb-12 px-6 md:pt-32 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-medium tracking-tight leading-[1.05] mb-8">
            A perfect resume for every application
          </h1>
          
          <Link href="/signup">
            <button className="group flex items-center gap-3 bg-[#1a1a1a] text-[#F2F1ED] px-6 py-3 rounded-full font-medium hover:bg-black transition-all">
              <span>Build your resume</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Resumes Image Section */}
      <section className="w-full px-4 md:px-8 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[40vh] md:h-[60vh] rounded-[2rem] overflow-hidden"
        >
          <Image 
            src="/resumes-on-table.png" 
            alt="Variety of printed resumes scattered on a wooden table" 
            fill 
            className="object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="w-full py-24 overflow-hidden bg-[#F2F1ED]">
        <div className="text-center mb-10 text-sm font-medium text-gray-500 uppercase tracking-wider">
          Trusted by professionals hired at
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-24 px-8">
            <MarqueeItem text="Google" />
            <MarqueeItem text="Meta" />
            <MarqueeItem text="Apple" />
            <MarqueeItem text="Netflix" />
            <MarqueeItem text="Amazon" />
            <MarqueeItem text="Microsoft" />
            <MarqueeItem text="Stripe" />
            <MarqueeItem text="Airbnb" />
          </div>
          {/* Duplicate for seamless infinite scrolling */}
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-24 px-8 absolute top-0" style={{ left: '100%' }}>
            <MarqueeItem text="Google" />
            <MarqueeItem text="Meta" />
            <MarqueeItem text="Apple" />
            <MarqueeItem text="Netflix" />
            <MarqueeItem text="Amazon" />
            <MarqueeItem text="Microsoft" />
            <MarqueeItem text="Stripe" />
            <MarqueeItem text="Airbnb" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#e5e5e5]">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-playfair font-medium tracking-tight mb-6">Built for impact</h2>
          <p className="text-gray-600 text-lg">Everything you need to craft a professional, ATS-optimized resume in minutes, powered by AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="ATS Optimized"
            description="Tested against top Applicant Tracking Systems to ensure perfect parsing."
          />
          <FeatureCard 
            title="AI Writing Assistant"
            description="Our integrated AI helps you craft the perfect summary and bullet points using the STAR method."
          />
          <FeatureCard 
            title="Premium Layouts"
            description="Export to pixel-perfect PDF layouts designed by top-tier typographers."
          />
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32 px-6 md:px-12 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-5xl font-playfair font-medium italic leading-relaxed mb-8">
            "I spent hours formatting my old CV. With Resume Maker, I had a gorgeous, perfectly tailored resume in 5 minutes that landed me my dream role."
          </h3>
          <p className="font-medium text-gray-500 uppercase tracking-widest text-sm">— Senior Engineer, Meta</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center bg-[#F2F1ED]">
        <h2 className="text-5xl md:text-7xl font-playfair font-medium tracking-tight mb-8">Ready to stand out?</h2>
        <Link href="/signup">
          <button className="group flex items-center gap-3 bg-[#1a1a1a] text-[#F2F1ED] px-8 py-4 rounded-full font-medium hover:bg-black transition-all mx-auto text-lg">
            <span>Get started for free</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </Link>
      </section>
    </main>
  );
}

function MarqueeItem({ text }: { text: string }) {
  return (
    <span className="text-2xl md:text-3xl font-playfair font-medium text-[#1a1a1a] opacity-80 mix-blend-multiply">
      {text}
    </span>
  );
}

function FeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white border border-[#e5e5e5] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 bg-[#F2F1ED] rounded-full mb-6 flex items-center justify-center">
        <div className="w-3 h-3 bg-[#1a1a1a] rounded-full"></div>
      </div>
      <h3 className="text-2xl font-playfair font-medium mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
