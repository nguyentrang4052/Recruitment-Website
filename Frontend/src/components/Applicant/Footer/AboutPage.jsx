import React from 'react';
import { AboutUs, TermsOfService, PrivacyPolicy, TermsAndConditions, Contact } from './About';
import Footer from './Footer';

const AboutPage = () => {
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