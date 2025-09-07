import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white mt-32 bottom-0 w-full'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <Image 
                src='/nano-marketer-logo.png' 
                alt='nano-marketer-logo' 
                width={40} 
                height={40}
                className='rounded-lg'
              />
              <h3 className='text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent'>
                Nano-Marketeer
              </h3>
            </div>
            <p className='text-gray-300 text-sm leading-relaxed'>
              Turn creativity into conversions with AI-powered ad generation and virtual try-on technology.
            </p>
            <div className='flex space-x-4'>
              <Link href='#' className='text-gray-400 hover:text-white transition-colors duration-200'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/>
                </svg>
              </Link>
              <Link href='#' className='text-gray-400 hover:text-white transition-colors duration-200'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z'/>
                </svg>
              </Link>
              <Link href='#' className='text-gray-400 hover:text-white transition-colors duration-200'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/>
                </svg>
              </Link>
              <Link href='#' className='text-gray-400 hover:text-white transition-colors duration-200'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.219-.438-.219-1.087c0-1.018.593-1.775 1.331-1.775.628 0 .931.469.931 1.031 0 .629-.399 1.569-.609 2.441-.173.729.365 1.323 1.086 1.323 1.302 0 2.301-1.375 2.301-3.356 0-1.753-1.259-2.979-3.056-2.979-2.082 0-3.306 1.562-3.306 3.176 0 .629.242 1.303.544 1.668.06.073.069.137.051.212-.056.235-.18.73-.204.832-.031.131-.101.159-.233.096-1.3-.607-2.114-2.511-2.114-4.04 0-3.295 2.394-6.32 6.901-6.32 3.628 0 6.447 2.584 6.447 6.043 0 3.606-2.274 6.504-5.431 6.504-1.061 0-2.059-.552-2.398-1.209 0 0-.524 1.992-.651 2.48-.236.908-.872 2.042-1.299 2.734.977.302 2.018.461 3.094.461 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z'/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li><Link href='/' className='text-gray-300 hover:text-white transition-colors duration-200'>Home</Link></li>
              <li><Link href='/ai-tryon' className='text-gray-300 hover:text-white transition-colors duration-200'>AI Try-On</Link></li>
              <li><Link href='/ad-creator' className='text-gray-300 hover:text-white transition-colors duration-200'>Ad Creator</Link></li>
              <li><Link href='/pricing' className='text-gray-300 hover:text-white transition-colors duration-200'>Pricing</Link></li>
              <li><Link href='/about' className='text-gray-300 hover:text-white transition-colors duration-200'>About Us</Link></li>
              <li><Link href='/blog' className='text-gray-300 hover:text-white transition-colors duration-200'>Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Support</h4>
            <ul className='space-y-2'>
              <li><Link href='/contact' className='text-gray-300 hover:text-white transition-colors duration-200'>Contact Us</Link></li>
              <li><Link href='/help' className='text-gray-300 hover:text-white transition-colors duration-200'>Help Center</Link></li>
              <li><Link href='/faq' className='text-gray-300 hover:text-white transition-colors duration-200'>FAQ</Link></li>
              <li><Link href='/privacy' className='text-gray-300 hover:text-white transition-colors duration-200'>Privacy Policy</Link></li>
              <li><Link href='/terms' className='text-gray-300 hover:text-white transition-colors duration-200'>Terms of Service</Link></li>
              <li><Link href='/refund' className='text-gray-300 hover:text-white transition-colors duration-200'>Refund Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Stay Updated</h4>
            <p className='text-gray-300 text-sm mb-4'>
              Subscribe to our newsletter for the latest updates and marketing tips.
            </p>
            <form className='space-y-3'>
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
              />
              <button
                type='submit'
                className='w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold py-2 px-4 rounded-md hover:from-yellow-500 hover:to-orange-600 transition-all duration-200'
              >
                Subscribe
              </button>
            </form>
            <div className='mt-4 space-y-2'>
              <div className='flex items-center space-x-2'>
                <svg className='w-4 h-4 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'/>
                  <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'/>
                </svg>
                <span className='text-gray-400 text-sm'>support@nano-marketer.com</span>
              </div>
              <div className='flex items-center space-x-2'>
                <svg className='w-4 h-4 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd'/>
                </svg>
                <span className='text-gray-400 text-sm'>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='text-gray-400 text-sm'>
              © 2025 Nano-Marketeer. All rights reserved.
            </div>
            <div className='flex items-center space-x-6 text-sm text-gray-400'>
              <Link href='/privacy' className='hover:text-white transition-colors duration-200'>Privacy</Link>
              <Link href='/terms' className='hover:text-white transition-colors duration-200'>Terms</Link>
              <Link href='/cookies' className='hover:text-white transition-colors duration-200'>Cookies</Link>
              <Link href='/sitemap' className='hover:text-white transition-colors duration-200'>Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer