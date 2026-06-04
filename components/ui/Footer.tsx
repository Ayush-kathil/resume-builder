import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-8 text-center border-t border-[#e5e5e5] bg-[#F2F1ED] absolute bottom-0 z-50 font-sans">
      <p className="text-gray-500 text-sm font-medium tracking-wide">
        Made by <span className="text-[#1a1a1a] font-semibold font-playfair italic text-base px-1">Kathil Software Limited</span> by{' '}
        <Link 
          href="https://ayushgupta3.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#1a1a1a] hover:text-black hover:underline decoration-gray-400 underline-offset-4 transition-all ml-1"
        >
          Ayush Gupta
        </Link>
      </p>
    </footer>
  );
}
