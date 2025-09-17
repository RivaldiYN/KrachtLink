import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
      const currentYear = new Date().getFullYear();

      const footerLinks = {
            company: [
                  { name: 'About Us', href: '/#about' },
                  { name: 'Our Services', href: '/#services' },
                  { name: 'Portfolio', href: '/#portfolio' },
                  { name: 'Blog', href: '/blog' },
            ],
            support: [
                  { name: 'Help Center', href: '/help' },
                  { name: 'Contact Us', href: '/#contact' },
                  { name: 'FAQ', href: '/faq' },
                  { name: 'Terms of Service', href: '/terms' },
            ],
            social: [
                  { name: 'Instagram', href: 'https://instagram.com/krachtlink' },
                  { name: 'Facebook', href: 'https://facebook.com/krachtlink' },
                  { name: 'Twitter', href: 'https://twitter.com/krachtlink' },
                  { name: 'LinkedIn', href: 'https://linkedin.com/company/krachtlink' },
            ],
      };

      return (
            <footer className="bg-gray-900 text-white">
                  <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                              {/* Company Info */}
                              <div className="lg:col-span-1">
                                    <Link to="/" className="text-2xl font-bold text-primary-400 mb-4 block">
                                          KrachtLink
                                    </Link>
                                    <p className="text-gray-300 text-sm mb-4">
                                          Platform promosi terdepan yang menghubungkan brand dengan content creator
                                          untuk menciptakan kampanye marketing yang efektif dan menguntungkan.
                                    </p>
                                    <div className="flex space-x-4">
                                          {footerLinks.social.map((social) => (
                                                <a
                                                      key={social.name}
                                                      href={social.href}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-gray-400 hover:text-primary-400 transition-colors"
                                                >
                                                      <span className="sr-only">{social.name}</span>
                                                      {/* You can add social icons here */}
                                                      <div className="w-6 h-6 bg-gray-600 rounded"></div>
                                                </a>
                                          ))}
                                    </div>
                              </div>

                              {/* Company Links */}
                              <div>
                                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                                          Company
                                    </h3>
                                    <ul className="space-y-2">
                                          {footerLinks.company.map((link) => (
                                                <li key={link.name}>
                                                      <Link
                                                            to={link.href}
                                                            className="text-gray-300 hover:text-white text-sm transition-colors"
                                                      >
                                                            {link.name}
                                                      </Link>
                                                </li>
                                          ))}
                                    </ul>
                              </div>

                              {/* Support Links */}
                              <div>
                                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                                          Support
                                    </h3>
                                    <ul className="space-y-2">
                                          {footerLinks.support.map((link) => (
                                                <li key={link.name}>
                                                      <Link
                                                            to={link.href}
                                                            className="text-gray-300 hover:text-white text-sm transition-colors"
                                                      >
                                                            {link.name}
                                                      </Link>
                                                </li>
                                          ))}
                                    </ul>
                              </div>

                              {/* Newsletter */}
                              <div>
                                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                                          Newsletter
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-4">
                                          Subscribe to get updates about new campaigns and opportunities.
                                    </p>
                                    <form className="space-y-2">
                                          <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                          />
                                          <button
                                                type="submit"
                                                className="w-full bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                                          >
                                                Subscribe
                                          </button>
                                    </form>
                              </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800">
                              <div className="flex flex-col md:flex-row justify-between items-center">
                                    <p className="text-gray-400 text-sm">
                                          © {currentYear} KrachtLink. All rights reserved.
                                    </p>
                                    <div className="flex space-x-6 mt-4 md:mt-0">
                                          <Link
                                                to="/privacy"
                                                className="text-gray-400 hover:text-white text-sm transition-colors"
                                          >
                                                Privacy Policy
                                          </Link>
                                          <Link
                                                to="/terms"
                                                className="text-gray-400 hover:text-white text-sm transition-colors"
                                          >
                                                Terms of Service
                                          </Link>
                                          <Link
                                                to="/cookies"
                                                className="text-gray-400 hover:text-white text-sm transition-colors"
                                          >
                                                Cookie Policy
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </div>
            </footer>
      );
};

export default Footer;