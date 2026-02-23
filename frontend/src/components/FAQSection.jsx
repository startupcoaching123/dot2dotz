import React, { useState } from 'react';
import { ChevronDown, Zap, HelpCircle } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is the difference between Half Load and Full Load?",
            answer: "Full Truck Load (FTL) means the entire truck is reserved for your shipment alone, ensuring faster direct delivery. Half Load (PTL) means your goods share space with others, which is more cost-effective for smaller volumes."
        },
        {
            question: "How can I track my shipment in real-time?",
            answer: "You can track your shipment through our advanced dashboard using your booking ID. We provide live GPS updates and milestone notifications directly to your phone."
        },
        {
            question: "Do you provide insurance for fragile goods?",
            answer: "Yes, we offer comprehensive cargo insurance for all types of goods, especially fragile ones. Our specialized handlers ensure extra care during loading and transit."
        },
        {
            question: "How do I get an instant price estimate?",
            answer: "Simply enter your pickup and delivery pin codes in our hero widget above. Our AI-driven engine calculates the most competitive rate instantly based on distance and load type."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Speed Background Decorative Elements */}
            <div className="absolute top-1/4 left-0 w-64 h-1 bg-red-600/5 -translate-x-1/2 transform skew-y-[-12deg]"></div>
            <div className="absolute bottom-1/4 right-0 w-64 h-1 bg-red-600/5 translate-x-1/2 transform skew-y-[-12deg]"></div>

            <div className="max-w-[1000px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100 mb-2 transform skew-x-[-12deg]">
                        <Zap size={14} className="text-red-600 animate-pulse" />
                        <span className="text-[10px] font-black italic uppercase tracking-widest text-black">Fast Support</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-black">
                        Common <span className="text-red-600">Questions</span>
                    </h2>
                    <p className="text-gray-500 font-bold italic uppercase tracking-widest text-sm leading-relaxed">
                        Everything you need to know about our logistics framework.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`group relative overflow-hidden transition-all duration-500 border-2 ${openIndex === index
                                ? 'border-red-600 bg-white ring-8 ring-red-50/50'
                                : 'border-gray-50 bg-gray-50/50 hover:border-black hover:bg-white'
                                } rounded-2xl md:rounded-[2rem] transform ${openIndex === index ? 'scale-[1.02] skew-x-[-1deg]' : ''}`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-8 py-6 md:py-8 flex items-center justify-between text-left relative z-10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${openIndex === index ? 'bg-red-600 text-white' : 'bg-white text-gray-400 group-hover:text-black'
                                        }`}>
                                        <HelpCircle size={18} />
                                    </div>
                                    <span className={`text-base md:text-lg font-black italic tracking-tight uppercase ${openIndex === index ? 'text-red-600' : 'text-gray-900'
                                        }`}>
                                        {faq.question}
                                    </span>
                                </div>
                                <div className={`transition-transform duration-500 transform ${openIndex === index ? 'rotate-180' : ''}`}>
                                    <ChevronDown className={openIndex === index ? 'text-red-600' : 'text-gray-400'} />
                                </div>
                            </button>

                            {/* Answer Area */}
                            <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[300px] opacity-100 pb-8 px-8' : 'max-h-0 opacity-0 overflow-hidden'
                                } ml-12`}>
                                <div className="pl-4 border-l-2 border-red-600/20">
                                    <p className="text-gray-500 font-bold italic text-sm md:text-base leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>

                            {/* Speed Trail Animation on Hover (Inactive state) */}
                            <div className="absolute top-0 right-[-100%] w-full h-full bg-gradient-to-r from-transparent via-red-600/5 to-transparent skew-x-[-45deg] group-hover:animate-fast-sweep"></div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 font-black italic uppercase tracking-widest text-xs mb-6">Still have questions?</p>
                    <button className="bg-black hover:bg-red-600 text-white font-black py-4 px-10 rounded-full italic tracking-widest uppercase text-sm transition-all duration-300 transform hover:scale-110 hover:skew-x-[-12deg] shadow-xl shadow-black/10 active:scale-95">
                        Contact Support Center
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fast-sweep {
                    0% { right: -100%; }
                    100% { right: 200%; }
                }
                .animate-fast-sweep {
                    animation: fast-sweep 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </section>
    );
};

export default FAQSection;
