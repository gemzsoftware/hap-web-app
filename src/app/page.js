import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { properties } from '@/data/properties';
import Header from '@/components/Header';

const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const StarIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const AreaIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" />
        <path d="M21 9V5a2 2 0 0 0-2-2h-4" />
        <path d="M12 3v18" />
    </svg>
);

const Hero = () => (
  <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-white">
    <div className="absolute inset-0">
        <Image
            src="/hero-background.jpg"
            alt="Expansive land for sale"
            layout="fill"
            objectFit="cover"
            quality={85}
            priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="relative z-10 text-center px-6">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
        Own a Piece of Tomorrow, Today
      </h1>
      <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
        Invest in prime Nigerian land with verified titles. Secure your future with Heaven Ark Properties.
      </p>
      <div className="bg-white rounded-full p-2 max-w-2xl mx-auto flex items-center shadow-2xl">
        <input
          type="text"
          placeholder="Enter a location, e.g., 'Epe', 'Ibeju-Lekki'..."
          className="w-full bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none px-4"
        />
        <button className="bg-[#800000] rounded-full p-3 hover:bg-[#660000] transition-colors">
          <SearchIcon className="text-white" />
        </button>
      </div>
    </div>
  </section>
);

const PropertyCard = ({ slug, image, price, title, location, size, landTitle }) => (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col">
        <div className="relative overflow-hidden">
            <Image src={image} alt={title} width={400} height={300} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"/>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                {landTitle}
            </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{location}</h3>
            <p className="text-gray-500 mb-4 flex-grow">{title}</p>
            <p className="text-3xl font-extrabold text-[#800000] mb-6">₦{new Intl.NumberFormat().format(price)}</p>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-auto">
                <div className="flex items-center gap-2 text-gray-600">
                    <AreaIcon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{size} sqm</span>
                </div>
                <Link href={`/properties/${slug}`} className="bg-white text-[#800000] border-2 border-[#800000] px-5 py-2 rounded-full font-semibold text-sm hover:bg-[#800000] hover:text-white transition-colors duration-300">
                    View Details
                </Link>
            </div>
        </div>
    </div>
);

const FeaturedProperties = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Featured Lands for Sale</h2>
                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-lg">Invest in the future with our prime, verified land selections.</p>
                </div>
                <div className="grid grid-cols-1 md:-cols-2 lg:grid-cols-3 gap-10">
                    {properties.map(prop => <PropertyCard key={prop.slug} {...prop} />)}
                </div>
            </div>
        </section>
    );
};

const BenefitItem = ({ number, icon, title, children }) => (
    <div className="relative overflow-hidden rounded-lg bg-white p-8 border border-gray-200 shadow-sm">
        <div className="absolute top-0 left-0 text-8xl font-extrabold text-gray-100/80 -translate-x-4 -translate-y-4 z-0">
            {number}
        </div>
        <div className="relative z-10">
            <div className="mb-4 text-[#800000]">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{children}</p>
        </div>
    </div>
);

const WhyChooseUs = () => (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Why Choose Heaven Ark</h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-lg">Your trusted partner in acquiring valuable land assets.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <BenefitItem
                    number="01"
                    title="Verified Titles"
                    icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                >
                    We conduct thorough due diligence on all land titles, ensuring your investment is secure and free from disputes.
                </BenefitItem>
                <BenefitItem
                    number="02"
                    title="Strategic Locations"
                    icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                >
                    Our properties are located in areas with high growth potential, guaranteeing excellent returns on investment.
                </BenefitItem>
                <BenefitItem
                    number="03"
                    title="Expert Guidance"
                    icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                >
                    Our team provides professional advice to help you make informed land acquisition decisions from start to finish.
                </BenefitItem>
            </div>
        </div>
    </section>
);

const WhoWeAre = () => (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Who We Are</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        Heaven Ark Properties is a premier real estate firm based in Lagos, Nigeria, specializing in the acquisition and sale of titled, verified, and strategically located lands. Founded on the principles of trust and transparency, we are dedicated to demystifying land ownership and making it an accessible, secure, and profitable venture for everyone.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Our team comprises seasoned real estate professionals, surveyors, and legal experts who work tirelessly to source and secure prime lands in high-growth areas. We guide our clients through every step of the investment journey, from initial inquiry to the final handover of documents, ensuring a seamless and rewarding experience.
                    </p>
                </div>
                <div className="order-1 lg:order-2">
                    <Image
                        src="/team-handshake.jpg"
                        alt="Heaven Ark Properties team discussing a blueprint"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-2xl object-cover"
                    />
                </div>
            </div>
        </div>
    </section>
);

const OurCoreValues = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800">Our Core Values</h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-lg">The principles that guide our business and relationships.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <BenefitItem
                    number="01"
                    title="Integrity"
                    icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                >
                    We operate with the highest level of honesty and transparency. Our clients' trust is our most valuable asset.
                </BenefitItem>
                <BenefitItem
                    number="02"
                    title="Excellence"
                    icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                >
                    We are committed to delivering the best possible service and value, ensuring every client interaction is exceptional.
                </BenefitItem>
                 <BenefitItem
                    number="03"
                    title="Client-Centric"
                    icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                >
                    Our clients are at the heart of everything we do. We listen, understand, and tailor our services to meet their unique needs.
                </BenefitItem>
            </div>
        </div>
    </section>
);

const TestimonialCard = ({ quote, author, role }) => (
    <div className="bg-gray-100 p-8 rounded-xl">
        <div className="flex mb-4">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400" />)}
        </div>
        <p className="text-gray-600 mb-6">"{quote}"</p>
        <div>
            <p className="font-semibold text-gray-800">{author}</p>
            <p className="text-gray-500 text-sm">{role}</p>
        </div>
    </div>
);

const Testimonials = () => (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800">What Our Clients Say</h2>
                <p className="text-gray-500 mt-2">Real stories from satisfied land owners.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TestimonialCard author="Mr. & Mrs. Adebayo" role="First-time Land Investors" quote="Heaven Ark made buying land in Lagos so easy and transparent. We felt secure throughout the process and are thrilled with our purchase in Epe." />
                <TestimonialCard author="Chief Okoro" role="Portfolio Investor" quote="The professionalism and quality of lands offered by Heaven Ark are unmatched. They are my go-to for expanding my real estate portfolio in Nigeria." />
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Heaven Ark Properties</h3>
                    <p className="text-gray-400">Your gateway to exceptional land investments.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center gap-2">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                           <span>Lekki, Lagos, Nigeria</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <a href="mailto:info@heavenark.com" className="hover:text-white">info@heavenark.com</a>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <a href="tel:+2348012345678" className="hover:text-white">+234 801 234 5678</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                     <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">Properties</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Newsletter</h4>
                    <p className="text-gray-400 mb-4">Get the latest listings and news.</p>
                    <div className="flex">
                        <input type="email" placeholder="Your email" className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none w-full" />
                        <button className="bg-[#800000] px-4 py-2 rounded-r-md hover:bg-[#660000]">Go</button>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
                <p>&copy; 2025 Heaven Ark Properties. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);


export default function Home() {
  return (
    <div className="bg-white text-gray-800">
      <Header />
      <main>
        <Hero />
        <FeaturedProperties />
        <WhyChooseUs />
        <WhoWeAre />
        <OurCoreValues />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}