import React, { useState } from 'react';

const faqData = [
  {
    question: "Je aplikácia zadarmo?",
    answer: "Áno, všetky základné funkcie ako sledovanie jedál, kalórií, tekutín a aktivít sú úplne zadarmo.",
  },
  {
    question: "Môžem si pridať vlastné jedlá a aktivity?",
    answer: "Áno! Môžeš si uložiť svoje vlastné jedlá a aktivity a následne ich rýchlo pridávať do kalendára.",
  },
  {
    question: "Funguje aplikácia aj bez pripojenia na internet?",
    answer: "Niektoré funkcie (napr. prezeranie uložených údajov) môžu fungovať offline, ale synchronizácia a ukladanie dát vyžaduje pripojenie.",
  },
  {
    question: "Je moje zdravie a výživa súkromná?",
    answer: "Áno, tvoje dáta sú bezpečne uložené v cloude a dostupné len pre teba po prihlásení.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 px-6">
      <h2 className="text-4xl font-semibold text-green-700 text-center mb-10">Často kladené otázky</h2>
      <div className="max-w-4xl mx-auto space-y-6">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border-b pb-4 cursor-pointer transition-all duration-300"
              onClick={() => toggleAnswer(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                <span className="text-green-600 font-bold text-2xl">
                  {isOpen ? '−' : '+'}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
