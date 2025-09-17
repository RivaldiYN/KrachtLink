import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import {
      Bars3Icon,
      XMarkIcon,
      SunIcon,
      MoonIcon,
      UserIcon,
      ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const Header = () => {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const { user, logout } = useAuth();
      const { isDark, toggleTheme } = useTheme();
      const location = useLocation();

      const navigation = [
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: 'About', href: '/#about' },
            { name: 'Services', href: '/#services' },
            { name: 'Portfolio', href: '/#portfolio' },
      ];

      const isActive = (href) => {
            if (href === '/') {
                  return location.pathname === '/';
            }
            return location.pathname.startsWith(href);
      };

      return (
            <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
                  <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                        {/* Logo */}
                        <div className="flex lg:flex-1">
                              <Link to="/" className="-m-1.5 p-1.5">
                                    <span className="text-2xl font-bold text-primary-600">KrachtLink</span>
                              </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex lg:hidden">
                              <button
                                    type="button"
                                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                                    onClick={() => setMobileMenuOpen(true)}
                              >
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                              </button>
                        </div>

                        {/* Desktop navigation */}
                        <div className="hidden lg:flex lg:gap-x-8">
                              {navigation.map((item) => (
                                    <Link
                                          key={item.name}
                                          to={item.href}
                                          className={clsx(
                                                'text-sm font-semibold leading-6 transition-colors',
                                                isActive(item.href)
                                                      ? 'text-primary-600'
                                                      : 'text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400'
                                          )}
                                    >
                                          {item.name}
                                    </Link>
                              ))}
                        </div>

                        {/* Right side buttons */}
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
                              {/* Theme toggle */}
                              <button
                                    onClick={toggleTheme}
                                    className="rounded-md p-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    aria-label="Toggle theme"
                              >
                                    {isDark ? (
                                          <SunIcon className="h-5 w-5" />
                                    ) : (
                                          <MoonIcon className="h-5 w-5" />
                                    )}
                              </button>

                              {user ? (
                                    <div className="flex items-center gap-x-4">
                                          <Link
                                                to={user.role === 'super_admin' ? '/admin' : '/member'}
                                                className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                                          >
                                                <UserIcon className="h-5 w-5" />
                                                Dashboard
                                          </Link>
                                          <button
                                                onClick={logout}
                                                className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                                          >
                                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                                Logout
                                          </button>
                                    </div>
                              ) : (
                                    <div className="flex items-center gap-x-4">
                                          <Link
                                                to="/auth/login"
                                                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                                          >
                                                Log in
                                          </Link>
                                          <Link
                                                to="/join"
                                                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
                                          >
                                                Join Now
                                          </Link>
                                    </div>
                              )}
                        </div>
                  </nav>

                  {/* Mobile menu */}
                  <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                        <div className="fixed inset-0 z-50" />
                        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                              <div className="flex items-center justify-between">
                                    <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                                          <span className="text-2xl font-bold text-primary-600">KrachtLink</span>
                                    </Link>
                                    <button
                                          type="button"
                                          className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                                          onClick={() => setMobileMenuOpen(false)}
                                    >
                                          <span className="sr-only">Close menu</span>
                                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                              </div>

                              <div className="mt-6 flow-root">
                                    <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/25">
                                          <div className="space-y-2 py-6">
                                                {navigation.map((item) => (
                                                      <Link
                                                            key={item.name}
                                                            to={item.href}
                                                            className={clsx(
                                                                  '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                                                                  isActive(item.href)
                                                                        ? 'text-primary-600'
                                                                        : 'text-gray-900 dark:text-gray-100'
                                                            )}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                      >
                                                            {item.name}
                                                      </Link>
                                                ))}
                                          </div>

                                          <div className="py-6">
                                                <div className="flex items-center justify-between mb-4">
                                                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme</span>
                                                      <button
                                                            onClick={toggleTheme}
                                                            className="rounded-md p-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                                                      >
                                                            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                                                      </button>
                                                </div>

                                                {user ? (
                                                      <div className="space-y-2">
                                                            <Link
                                                                  to={user.role === 'super_admin' ? '/admin' : '/member'}
                                                                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                                  onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                  Dashboard
                                                            </Link>
                                                            <button
                                                                  onClick={() => {
                                                                        logout();
                                                                        setMobileMenuOpen(false);
                                                                  }}
                                                                  className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            >
                                                                  Logout
                                                            </button>
                                                      </div>
                                                ) : (
                                                      <div className="space-y-2">
                                                            <Link
                                                                  to="/auth/login"
                                                                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                                  onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                  Log in
                                                            </Link>
                                                            <Link
                                                                  to="/join"
                                                                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-center text-white bg-primary-600 hover:bg-primary-500"
                                                                  onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                  Join Now
                                                            </Link>
                                                      </div>
                                                )}
                                          </div>
                                    </div>
                              </div>
                        </Dialog.Panel>
                  </Dialog>
            </header>
      );
};

export default Header;