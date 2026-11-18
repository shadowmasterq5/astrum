/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { AiIdeaMakerSection } from './components/AiIdeaMakerSection';
import { FeaturedWorkSection } from './components/FeaturedWorkSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ServicesAndPricingSection } from './components/ServicesAndPricingSection';
import { StorySection } from './components/StorySection';
import { StudioMarquee } from './components/StudioMarquee';

export default function App() {
  const [selectedTier, setSelectedTier] = useState('Business & Storefront (₹4,500 – ₹10,000)');
  const [presetIdeaText, setPresetIdeaText] = useState('');

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectTier = useCallback(
    (tierLabel: string) => {
      setSelectedTier(tierLabel);
      scrollToSection('idea-maker');
    },
    [scrollToSection]
  );

  const handleOrderSimilar = useCallback(
    (presetIdea: string, presetTier: string) => {
      setPresetIdeaText(presetIdea);
      setSelectedTier(presetTier);
      scrollToSection('idea-maker');
    },
    [scrollToSection]
  );

  const handlePresetConsumed = useCallback(() => {
    setPresetIdeaText('');
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-950">
      <Navbar onStartProject={() => scrollToSection('idea-maker')} />
      <main>
        <HeroSection
          onOpenIdeaMaker={() => scrollToSection('idea-maker')}
          onInspectWork={() => scrollToSection('work')}
        />
        <StudioMarquee />
        <StorySection />
        <FeaturedWorkSection onOrderSimilar={handleOrderSimilar} />
        <ServicesAndPricingSection selectedTier={selectedTier} onSelectTier={handleSelectTier} />
        <AiIdeaMakerSection
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
          presetIdeaText={presetIdeaText}
          onPresetConsumed={handlePresetConsumed}
        />
      </main>
      <Footer />
    </div>
  );
}
