import React from 'react';

const Terms = () => {
  return (
    <section className="max-w-2xl mt-20 mx-auto py-10 px-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-green-700">Podmienky používania</h2>
      <p className="mt-4 text-gray-600">Posledná aktualizácia: 21. február 2025</p>

      <p className="mt-4">
        Vitajte v našej aplikácii <strong>[Your App Name]</strong>. Používaním tejto aplikácie súhlasíte s nasledujúcimi podmienkami.
      </p>

      <h3 className="mt-6 text-xl font-semibold">1. Akceptácia podmienok</h3>
      <p className="mt-2">
        Používaním našich služieb vyjadrujete súhlas s týmito podmienkami. Ak s nimi nesúhlasíte, nesmiete aplikáciu používať.
      </p>

      <h3 className="mt-6 text-xl font-semibold">2. Vytvorenie účtu</h3>
      <p className="mt-2">
        Pri registrácii musíte poskytnúť pravdivé a aktuálne informácie. Ste zodpovedný za bezpečnosť vášho účtu.
      </p>

      <h3 className="mt-6 text-xl font-semibold">3. Zakázané aktivity</h3>
      <p className="mt-2">
        Používateľ nesmie:
        <ul className="list-disc ml-6 mt-2">
          <li>Porušovať platné zákony alebo práva tretích strán.</li>
          <li>Vytvárať falošné účty alebo sa vydávať za iných.</li>
          <li>Zasahovať do bezpečnosti aplikácie.</li>
        </ul>
      </p>

      <h3 className="mt-6 text-xl font-semibold">4. Zrušenie účtu</h3>
      <p className="mt-2">
        Môžeme zablokovať alebo odstrániť váš účet v prípade porušenia podmienok alebo neaktivity.
      </p>

      <h3 className="mt-6 text-xl font-semibold">5. Zodpovednosť a obmedzenie</h3>
      <p className="mt-2">
        Nenesieme zodpovednosť za akékoľvek priame alebo nepriame škody spôsobené používaním tejto aplikácie.
      </p>

      <h3 className="mt-6 text-xl font-semibold">6. Zmeny podmienok</h3>
      <p className="mt-2">
        Vyhradzujeme si právo kedykoľvek upraviť tieto podmienky. Pokračovanie v používaní aplikácie znamená súhlas so zmenami.
      </p>

      <h3 className="mt-6 text-xl font-semibold">7. Kontakt</h3>
      <p className="mt-2">
        Ak máte otázky týkajúce sa týchto podmienok, kontaktujte nás na <a href="mailto:support@yourapp.com" className="text-blue-600 underline">support@yourapp.com</a>.
      </p>
    </section>
  );
};

export default Terms;
