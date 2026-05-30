import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-6 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm absolute bottom-0 z-50">
      <p className="text-gray-400 text-sm font-medium">
        Made by <span className="text-white font-semibold">Kathil Software Limited</span> by{' '}
        <Link 
          href="https://ayushgupta3.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30 underline-offset-4 transition-colors"
        >
          Ayush Gupta
        </Link>
      </p>
    </footer>
  );
}
