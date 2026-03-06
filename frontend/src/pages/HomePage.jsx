import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import CoreFeatures from './components/CoreFeatures';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FAQSection from './components/FAQSection';
import ReadyToShip from './components/ReadyToShip';

const HomePage = () => {
    return (
        <div className="flex flex-col relative">
            {/* Background Road Element */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[40px] h-full opacity-[0.03] pointer-events-none hidden lg:block z-0">
                <div className="w-full h-full bg-black"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-around">
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className="w-2 h-10 bg-white"></div>
                    ))}
                </div>
            </div>

            <Hero />
            <WhyChooseUs />
            <CoreFeatures />
            <ServicesSection />
            <HowItWorks />
            <Testimonials />
            <FAQSection />
            <ReadyToShip />
        </div>
    );
};

export default HomePage;
