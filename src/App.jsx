import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroHeader from './components/HeroHeader';
import InteractiveDemo from './components/InteractiveDemo';
import ComparisonSection from './components/ComparisonSection';
import UseCasesSection from './components/UseCasesSection';
import FeaturesSection from './components/FeaturesSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import './theme.css';
import './LandingPage.css';

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const scrollToDemo = () => {
    const demoEl = document.getElementById('demo-section');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.location.hash !== '#demo-section') {
      history.pushState(null, '', '#demo-section');
    }
  };

  return (
    <div className="landing-page-root">
      <a href="#main-content" className="skip-link">Hoppa till innehåll</a>
      {/* Top Sticky Navigation */}
      <Navbar onOpenBooking={() => setBookingOpen(true)} />

      {/* Main Content Sections: Value-first flow */}
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroHeader
          onOpenBooking={() => setBookingOpen(true)}
          onScrollToDemo={scrollToDemo}
        />

        {/* Guided Interactive Split-View Showcase */}
        <section className="demo-outer-section">
          <InteractiveDemo onOpenBooking={() => setBookingOpen(true)} />
        </section>

        {/* 01 · Varför Träff: Generisk AI vs Träff (Gissning mot bevis) */}
        <ComparisonSection />

        {/* 02 · Vem: Tillämpning & Roller (Verkliga avtal och frågor) */}
        <UseCasesSection onOpenBooking={() => setBookingOpen(true)} />

        {/* 03 · Hur: Arkitektur & Trygghet (EU-lagring, noll modellträning, djuplänk, RBAC) */}
        <FeaturesSection />

        {/* 04 · Frågor & Svar: Vanliga funderingar */}
        <FaqSection />
      </main>

      {/* Footer & Conversion Banner */}
      <Footer onOpenBooking={() => setBookingOpen(true)} />

      {/* Book Demo Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
