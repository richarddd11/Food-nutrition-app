import React from 'react'

const testimonials = [
    {
      name: "Jana M.",
      text: "Vďaka GetFit som konečne začala sledovať, čo jem. Za mesiac som schudla 3 kg a cítim sa skvele!",
    },
    {
      name: "Martin K.",
      text: "Kalendár a prehľad výživy sú fantastické. Skvelá appka pre každého, kto chce žiť zdravšie.",
    },
    {
      name: "Petra L.",
      text: "Jednoduché používanie, pekný dizajn a spoľahlivý výpočet makier. Určite odporúčam!",
    },
  ];

const TestimonialSection = () => {
  return (
    <section className='bg-gray-100 py-16 px-6'>
        <h2 className="text-4xl font-semibold text-green-700 text-center mb-12">Čo hovoria naši používatelia</h2>
        <div className='max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3'>
            {testimonials.map((t, i) => (
                <div key={i} className='bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500'>
                    <p className="text-gray-800 text-lg italic mb-4">"{t.text}"</p>
                    <p className="text-green-700 font-semibold">– {t.name}</p>        
                </div>
            ))}
        </div>
    </section>
  )
}

export default TestimonialSection