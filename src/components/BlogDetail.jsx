import React from 'react'
import { useParams, Link } from "react-router-dom";

const blogPosts = [
    {
      id: 1,
      title: "Top 5 zdravých potravín na spaľovanie tukov",
      image: `${import.meta.env.BASE_URL}images/blogPhoto2.jpeg`,
      content: (
        <>
          <p>
            Spaľovanie tukov nie je len o cvičení, ale aj o správnej výžive. Medzi
            najlepšie potraviny, ktoré ti pomôžu spaľovať tuky patria:
          </p>
          <ul className="list-disc list-inside mt-4">
            <li><strong>Avokádo</strong> – obsahuje zdravé tuky, ktoré podporujú metabolizmus.</li>
            <li><strong>Losos</strong> – bohatý na omega-3 mastné kyseliny, ktoré pomáhajú regulovať hladinu cukru v krvi.</li>
            <li><strong>Zelený čaj</strong> – zrýchľuje spaľovanie kalórií a podporuje trávenie.</li>
            <li><strong>Chilli papričky</strong> – obsahujú kapsaicín, ktorý podporuje spaľovanie tukov.</li>
            <li><strong>Orechy</strong> – skvelý zdroj bielkovín a zdravých tukov.</li>
          </ul>
          <p className="mt-6">
            <span className="font-semibold text-green-600">Záver:</span> Pravidelné konzumovanie týchto potravín v kombinácii s fyzickou aktivitou môže výrazne pomôcť pri spaľovaní tukov a udržiavaní zdravej hmotnosti.
          </p>
        </>
      ),
    },
    {
      id: 2,
      title: "Ako správne kombinovať sacharidy, tuky a bielkoviny?",
      image: `${import.meta.env.BASE_URL}images/blogPhoto3.jpeg`,
      content: (
        <>
          <p>
            Vyvážená strava je základ zdravého životného štýlu. Dôležité je
            pochopiť, ako správne kombinovať makroživiny:
          </p>
          <ul className="list-disc list-inside mt-4">
            <li><strong>Sacharidy</strong> – hlavný zdroj energie. Ideálne sú celozrnné potraviny, ovocie a zelenina.</li>
            <li><strong>Tuky</strong> – esenciálne pre správne fungovanie organizmu. Uprednostni zdravé tuky ako olivový olej, orechy a avokádo.</li>
            <li><strong>Bielkoviny</strong> – dôležité pre svalovú regeneráciu. Kvalitné zdroje sú kuracie mäso, ryby, tofu a strukoviny.</li>
          </ul>
          <p className="mt-6">
            <span className="font-semibold text-green-600">Tip:</span> Správne jedlo by malo obsahovať vyvážený pomer všetkých troch makroživín. Napríklad:
          </p>
          <ul className="list-disc list-inside mt-4">
            <li><strong>Raňajky:</strong> Ovsená kaša s mandľami a banánom.</li>
            <li><strong>Obed:</strong> Grilované kuracie mäso s quinoou a avokádovým šalátom.</li>
            <li><strong>Večera:</strong> Pečený losos s dusenou zeleninou.</li>
          </ul>
        </>
      ),
    },
    {
      id: 3,
      title: "Prečo je hydratácia kľúčová pri chudnutí?",
      image: `${import.meta.env.BASE_URL}images/blogPhoto1.jpeg`,
      content: (
        <>
          <p>
            Voda hrá zásadnú úlohu pri metabolizme a chudnutí. Je dôležité
            dodržiavať správny pitný režim:
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>Pomáha tráveniu a detoxikácii organizmu.</li>
            <li>Podporuje spaľovanie tukov.</li>
            <li>Znižuje pocit hladu – často si zamieňame smäd za hlad.</li>
          </ul>
          <p className="mt-6">
            <span className="font-semibold text-green-600">Koľko vody by si mal/a piť?</span>
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>Minimálne <strong>2-3 litre denne</strong>.</li>
            <li>Počas cvičenia doplň aspoň <strong>0,5 L vody</strong> na hodinu.</li>
            <li>Ráno začni pohárom vody s citrónom pre lepší metabolizmus.</li>
          </ul>
        </>
      ),
    },
  ];

const BlogDetail = () => {
    const { id } = useParams();
    const post = blogPosts.find((p) => p.id === parseInt(id));

    if (!post) {
        return <p className="text-center text-red-600 text-xl mt-10">Článok neexistuje!</p>;
    }
  return (
    <div>
        <section className='max-w-4xl mx-auto py-16 mt-8 px-6'>
            <img src={post.image} alt={post.title} className='w-full h-80 object-cover rounded-lg mb-6' />
            <h1 className='text-4xl font-bold text-green-700'>{post.title}</h1>
            <div className='text-gray-700 mt-6 leading-fixed'>{post.content}</div>
            <Link to="/" className='inline-block mt-6 text-green-700 font-semibold hover:underline'> ← Späť na blog</Link>
        </section>
    </div>
  )
}

export default BlogDetail