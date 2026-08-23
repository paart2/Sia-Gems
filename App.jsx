import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import ProductGrid from './components/ProductGrid';
import BespokeSection from './components/BespokeSection';
import BirthstonesSection from './components/BirthstonesSection';
import AboutSection from './components/AboutSection';
import WarrantySection from './components/WarrantySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import WishlistDrawer from './components/WishlistDrawer';
import EnquiryModal from './components/EnquiryModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('collections');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Wishlist persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sia_gems_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sia_gems_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryInitialProduct, setEnquiryInitialProduct] = useState(null);

  // Smooth Navigation Handler for all buttons
  const handleNavigate = (sectionId) => {
    setActiveTab(sectionId);

    let targetElementId = '';
    if (sectionId === 'collections') targetElementId = 'catalog-section';
    else if (sectionId === 'bespoke') targetElementId = 'bespoke-section';
    else if (sectionId === 'birthstones') targetElementId = 'birthstones-section';
    else if (sectionId === 'about') targetElementId = 'about-section';
    else if (sectionId === 'warranty') targetElementId = 'warranty-section';
    else if (sectionId === 'contact') targetElementId = 'contact-section';
    else targetElementId = `${sectionId}-section`;

    const el = document.getElementById(targetElementId);
    if (el) {
      const yOffset = -90; // account for fixed header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (sectionId === 'collections') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ScrollSpy to dynamically highlight active tab as user scrolls
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = [
        { id: 'collections', elementId: 'catalog-section' },
        { id: 'bespoke', elementId: 'bespoke-section' },
        { id: 'birthstones', elementId: 'birthstones-section' },
        { id: 'about', elementId: 'about-section' },
        { id: 'warranty', elementId: 'warranty-section' },
        { id: 'contact', elementId: 'contact-section' },
      ];

      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        const el = document.getElementById(sec.elementId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(sec.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => 
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectCategory = (catName) => {
    setSelectedCategory(catName);
    handleNavigate('collections');
  };

  const handleOpenEnquire = (product = null) => {
    setEnquiryInitialProduct(product);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#2c1d17] flex flex-col justify-between selection:bg-[#b88e4c] selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenEnquiryModal={() => handleOpenEnquire(null)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection
          onExplore={() => handleNavigate('collections')}
          onBespoke={() => handleNavigate('bespoke')}
        />

        {/* Category Visual Cards */}
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 111 Masterpieces Product Catalog */}
        <ProductGrid
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onEnquireProduct={(product) => handleOpenEnquire(product)}
        />

        {/* Bespoke Custom 3D Design Wizard */}
        <BespokeSection />

        {/* Birthstones Guide */}
        <BirthstonesSection
          onSelectGemstone={(gemName) => {
            setSelectedCategory('All');
            setSearchQuery(gemName);
            handleNavigate('collections');
          }}
        />

        {/* Brand Legacy / Story */}
        <AboutSection />

        {/* Limited Lifetime Warranty Registration */}
        <WarrantySection />

        {/* Client Concierge / Contact */}
        <ContactSection />

      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={toggleWishlist}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
      />

      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onEnquireProduct={(product) => handleOpenEnquire(product)}
      />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        initialProduct={enquiryInitialProduct}
      />

    </div>
  );
}
