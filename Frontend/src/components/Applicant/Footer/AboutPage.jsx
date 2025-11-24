import React from 'react';
import { AboutUs, TermsOfService, PrivacyPolicy, TermsAndConditions, Contact } from './About';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const AboutPage = () => {
  const { hash, state } = useLocation();

  useEffect(() => {
    const id = hash ? hash.replace('#', '') : state?.scrollTo;
    if (!id) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);

    return () => clearTimeout(timer);
  }, [hash, state]);
  return (
    <div>
      <AboutUs />
      <TermsOfService />
      <PrivacyPolicy />
      <TermsAndConditions />
      <Contact />
    </div>
  );
};

export default AboutPage;