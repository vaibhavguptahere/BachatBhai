import React from 'react'
import Link from 'next/link'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className="bg-blue-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
            <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-600 dark:text-gray-300">

                {/* Brand Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">BaChatBhai</h2>
                    <p className="mt-3 text-sm">
                        Track your expenses, manage budgets, and take control of your financial journey.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200">Resources</h3>
                    <ul className="mt-3 space-y-2">
                        <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
                        <li><Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
                        <li><Link href="/transaction/create" className="hover:text-blue-600">Add Transaction</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200">Support</h3>
                    <ul className="mt-3 space-y-2">
                        <li><Link href="" className="hover:text-blue-600">Help Center</Link></li>
                        <li><Link href="" className="hover:text-blue-600">Privacy Policy</Link></li>
                        <li><Link href="" className="hover:text-blue-600">Terms of Service</Link></li>
                        <li><Link href="" className="hover:text-blue-600">Contact</Link></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200">Connect</h3>
                    <div className="flex space-x-4 mt-3">
                        <a href="https://www.linkedin.com/in/vaibhavguptahere-/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                            <FaLinkedin size={22} />
                        </a>
                        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                            <FaGithub size={22} />
                        </a>
                        <a href="mailto:your@email.com" className="hover:text-blue-600">
                            <FaEnvelope size={22} />
                        </a>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Made with ❤️ by <span className="font-semibold">
                    <a href="https://www.linkedin.com/in/vaibhavguptahere-/" target="_blank" rel="noopener noreferrer">
                        Vaibhav Gupta
                    </a>
                </span> © {new Date().getFullYear()}
            </div>
        </div>
    )
}

export default Footer
