import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <section className="py-20 bg-white font-sans overflow-hidden">
            <div className="max-w-5xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Common Questions
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                        Everything you need to know about our logistics framework.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="group bg-slate-50 rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between text-left relative overflow-hidden"
                                >
                                    {/* Left Accent Bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 transition-transform duration-300 transform scale-y-75 group-hover:scale-y-100" />

                                    <div className="px-8 py-6 md:py-8 md:px-10 flex items-center justify-between w-full">
                                        <span className={`text-base md:text-lg font-bold tracking-tight pr-8 ${isOpen ? 'text-red-600' : 'text-slate-800'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`transition-transform duration-500 transform ${isOpen ? 'rotate-180 text-red-600' : 'text-slate-400'}`}>
                                            <ChevronDown size={24} />
                                        </div>
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="px-8 pb-8 md:pb-10 md:px-10 ml-1.5">
                                                <div className="max-w-2xl text-slate-500 font-medium leading-relaxed md:text-base">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">Didn't find what you need?</p>
                    <button className="bg-slate-900 text-white font-bold py-5 px-12 rounded-2xl hover:bg-red-600 transition-all duration-300 shadow-lg active:scale-95 text-xs tracking-widest uppercase">
                        Contact Support Center
                    </button>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
                .font-sans {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </section>
    );
};

export default FAQSection;
