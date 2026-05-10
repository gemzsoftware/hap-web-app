import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import TrustBar from '@/components/home/TrustBar'
import FeaturedLands from '@/components/home/FeaturedLands'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'
import CTABanner from '@/components/home/CTABanner'

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <TrustBar />
                <FeaturedLands />
                <HowItWorks />
                <Testimonials />
                <CTABanner />
            </main>
            <Footer />
        </>
    )
}