import React from 'react'
import { Link } from "react-router-dom";

const blogPosts = [
    {
      id: 1,
      title: "Top 5 zdravých potravín na spaľovanie tukov",
      excerpt: "Tieto potraviny ti pomôžu zrýchliť metabolizmus a efektívne spaľovať tuk.",
      image: `${import.meta.env.BASE_URL}images/blogPhoto2.jpeg`,
      content: "Celý článok o zdravých potravinách...",
    },
    {
      id: 2,
      title: "Ako správne kombinovať sacharidy, tuky a bielkoviny?",
      excerpt: "Vyvážená strava je kľúčom k zdraviu. Pozri si, ako kombinovať makroživiny.",
      image: `${import.meta.env.BASE_URL}images/blogPhoto3.jpeg`,
      content: "Celý článok o kombinovaní makroživín...",
    },
    {
      id: 3,
      title: "Prečo je hydratácia kľúčová pri chudnutí?",
      excerpt: "Pitný režim hrá obrovskú úlohu pri tvojom metabolizme a spaľovaní tukov.",
      image: `${import.meta.env.BASE_URL}images/blogPhoto1.jpeg`,
      content: "Celý článok o hydratácii a jej výhodách...",
    },
  ];

const BlogSection = () => {
  return (
    <div>
        <section className='max-w-6xl mx-auto pb-16 px-6'>
            <h2 className='text-4xl font-semibold text-green-700 text-center mb-10'>
            Najnovšie tipy a rady
            </h2>
            <div className="grid gird-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <div key={post.id} className='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition'>
                        <img src={post.image} alt={post.title} className='w-full h-48 object-cover' />
                        <div className="p-6">
                            <h3 className='text-2xl font-bold text-green-600'>{post.title}</h3>
                            <p className='text-gray-700 mt-3'>{post.excerpt}</p>
                            <Link to={`/blog/${post.id}`} className='inline-block mt-4 text-green-700 font-semibold hover:underline'>
                            Čítať viac →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
  )
}

export default BlogSection