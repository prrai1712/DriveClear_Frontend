import { TrustStrip } from "@/components/home/TrustStrip";
import { HomeHeader } from "@/components/home/HomeHeader";
import { VehicleSearchHero } from "@/components/home/VehicleSearchHero";
import { StatsRow } from "@/components/home/StatsRow";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FaqSection } from "@/components/home/FaqSection";
import { TermsSection } from "@/components/home/TermsSection";
import { TrackOrdersCta } from "@/components/home/TrackOrdersCta";

export default function VehiclePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-[max(7rem,calc(5rem+env(safe-area-inset-bottom)))]">
      <TrustStrip />
      <HomeHeader />
      <VehicleSearchHero />
      <StatsRow />
      <BenefitsSection />
      <HowItWorks />
      <FaqSection />
      <TermsSection />
      <TrackOrdersCta />
    </main>
  );
}
