import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
      UserGroupIcon,
      TrophyIcon,
      ChartBarIcon,
      ShieldCheckIcon,
      LightBulbIcon,
      HeartIcon
} from '@heroicons/react/24/outline';

const About = () => {
      const [ref, inView] = useInView({
            threshold: 0.1,
            triggerOnce: true
      });

      const features = [
            {
                  icon: UserGroupIcon,
                  title: 'Community Driven',
                  description: 'Platform yang dibangun oleh dan untuk komunitas content creator Indonesia.'
            },
            {
                  icon: ShieldCheckIcon,
                  title: 'Trusted & Secure',
                  description: 'Sistem keamanan berlapis dan pembayaran yang terjamin untuk semua member.'
            },
            {
                  icon: ChartBarIcon,
                  title: 'Data Analytics',
                  description: 'Dashboard analytics lengkap untuk tracking performa campaign secara real-time.'
            },
            {
                  icon: TrophyIcon,
                  title: 'Reward System',
                  description: 'Sistem reward dan gamifikasi yang membuat setiap campaign menjadi lebih menarik.'
            },
            {
                  icon: LightBulbIcon,
                  title: 'Innovation',
                  description: 'Terus berinovasi dengan teknologi terdepan untuk pengalaman terbaik.'
            },
            {
                  icon: HeartIcon,
                  title: 'Care & Support',
                  description: 'Tim support 24/7 yang siap membantu setiap kebutuhan member kami.'
            },
      ];

      const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                  opacity: 1,
                  transition: {
                        staggerChildren: 0.2,
                  },
            },
      };

      const itemVariants = {
            hidden: { opacity: 0, y: 30 },
            visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                        duration: 0.6,
                  },
            },
      };

      return (
            <section id="about" className="py-20 bg-white dark:bg-gray-900">
                  <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                              ref={ref}
                              variants={containerVariants}
                              initial="hidden"
                              animate={inView ? "visible" : "hidden"}
                              className="text-center mb-16"
                        >
                              <motion.span
                                    variants={itemVariants}
                                    className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-medium rounded-full mb-4"
                              >
                                    Tentang Kami
                              </motion.span>

                              <motion.h2
                                    variants={itemVariants}
                                    className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                              >
                                    Membangun Ekosistem{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                                          Digital Marketing
                                    </span>
                                    {' '}Terdepan
                              </motion.h2>

                              <motion.p
                                    variants={itemVariants}
                                    className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
                              >
                                    KrachtLink hadir sebagai solusi inovatif yang menghubungkan brand dengan content creator
                                    terbaik di Indonesia. Kami percaya bahwa kolaborasi yang tepat dapat menghasilkan
                                    kampanye marketing yang luar biasa dan menguntungkan semua pihak.
                              </motion.p>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                              {/* Left Content */}
                              <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate={inView ? "visible" : "hidden"}
                                    className="space-y-8"
                              >
                                    <div>
                                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                                Visi Kami
                                          </h3>
                                          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                                Menjadi platform nomor satu di Asia Tenggara yang menghubungkan brand dengan
                                                content creator untuk menciptakan kampanye marketing yang impactful dan sustainable.
                                          </p>
                                    </div>

                                    <div>
                                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                                Misi Kami
                                          </h3>
                                          <ul className="space-y-3 text-lg text-gray-600 dark:text-gray-300">
                                                <li className="flex items-start">
                                                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mt-1 mr-3">
                                                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                                      </div>
                                                      Memberikan platform yang mudah, aman, dan menguntungkan untuk semua member
                                                </li>
                                                <li className="flex items-start">
                                                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mt-1 mr-3">
                                                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                                      </div>
                                                      Mengembangkan teknologi terdepan untuk optimalisasi campaign marketing
                                                </li>
                                                <li className="flex items-start">
                                                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mt-1 mr-3">
                                                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                                      </div>
                                                      Membangun komunitas creator yang solid dan saling mendukung
                                                </li>
                                          </ul>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                          <div className="text-center">
                                                <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
                                                <div className="text-gray-600 dark:text-gray-300">Active Creators</div>
                                          </div>
                                          <div className="text-center">
                                                <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                                                <div className="text-gray-600 dark:text-gray-300">Brand Partners</div>
                                          </div>
                                          <div className="text-center">
                                                <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
                                                <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
                                          </div>
                                          <div className="text-center">
                                                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                                                <div className="text-gray-600 dark:text-gray-300">Support</div>
                                          </div>
                                    </div>
                              </motion.div>

                              {/* Right Content - Image */}
                              <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate={inView ? "visible" : "hidden"}
                                    className="relative"
                              >
                                    <div className="relative bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                                          {/* Placeholder for company image/illustration */}
                                          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl">
                                                <div className="grid grid-cols-3 gap-4 mb-6">
                                                      {[1, 2, 3, 4, 5, 6].map((i) => (
                                                            <div key={i} className="h-12 bg-gradient-to-r from-primary-200 to-blue-200 dark:from-primary-800 dark:to-blue-800 rounded-lg"></div>
                                                      ))}
                                                </div>
                                                <div className="h-32 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-lg"></div>
                                          </div>

                                          {/* Floating Elements */}
                                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full animate-bounce-gentle"></div>
                                          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                                    </div>
                              </motion.div>
                        </div>

                        {/* Features Grid */}
                        <motion.div
                              variants={containerVariants}
                              initial="hidden"
                              animate={inView ? "visible" : "hidden"}
                              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                              {features.map((feature, index) => (
                                    <motion.div
                                          key={index}
                                          variants={itemVariants}
                                          className="group p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
                                    >
                                          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                                <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                          </div>
                                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                                {feature.title}
                                          </h3>
                                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {feature.description}
                                          </p>
                                    </motion.div>
                              ))}
                        </motion.div>
                  </div>
            </section>
      );
};

export default About;