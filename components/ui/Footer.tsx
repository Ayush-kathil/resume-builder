import Link from 'next/link';

export function Footer() {
  return (
    // Fix Footer: changed from absolute bottom-0 z-50 (which overlaps builder mobile nav)
    // to relative positioning. The body already has pb-20 so pages clear the footer naturally.
    <footer className="w-full py-6 border-t border-[#e5e5e5] bg-[#F2F1ED] z-10 font-sans">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm font-medium tracking-wide text-center sm:text-left">
          {/* Fix: removed grammatically broken "Made by ... by ..." */}
          Made with ❤️ by{' '}
          <Link 
            href="https://ayushgupta3.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#1a1a1a] hover:text-black hover:underline decoration-gray-400 underline-offset-4 transition-all"
          >
            Ayush Gupta
          </Link>
          {' '}at Kathil Software
        </p>
        {/* Added footer nav links for production readiness */}
        <nav className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/pricing" className="hover:text-[#1a1a1a] transition-colors">Pricing</Link>
          <span className="text-gray-300">·</span>
          <Link href="/privacy" className="hover:text-[#1a1a1a] transition-colors">Privacy</Link>
          <span className="text-gray-300">·</span>
          <Link href="/terms" className="hover:text-[#1a1a1a] transition-colors">Terms</Link>
          <span className="text-gray-300">·</span>
          <Link
            href="https://github.com/Ayush-kathil/ai-resume-maker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1a1a1a] transition-colors"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </footer>
  );
}
