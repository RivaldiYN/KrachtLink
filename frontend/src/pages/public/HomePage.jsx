import React from 'react';
import Hero from '../../components/landing/Hero';
import About from '../../components/landing/About';
import Services from '../../components/landing/Services';
import Portfolio from '../../components/landing/Portfolio';
import Testimonials from '../../components/landing/Testimonials';
import Partners from '../../components/landing/Partners';
import BlogSection from '../../components/landing/BlogSection';
import CampaignShowcase from '../../components/landing/CampaignShowcase';

const HomePage = () => {
      return (
            <div>
                  <Hero />
                  <About />
                  <Services />
                  <CampaignShowcase />
                  <Portfolio />
                  <Testimonials />
                  <Partners />
                  <BlogSection />
            </div>
      );
};

export default HomePage;