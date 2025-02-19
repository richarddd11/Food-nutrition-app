import React from "react";

const FeaturesSection = ({ query, setQuery, handleSearch, disabled }) => {
  return (
    <section className="max-w-5xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-semibold text-green-700 text-center mb-6">Prečo si vybrať našu platformu?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-2xl font-bold text-green-600">Sledujte svoju výživu</h3>
          <p className="text-gray-700 mt-3">Ľahko zaznamenávajte svoje jedlá a sledujte makrá bez problémov.</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-2xl font-bold text-green-600">Personalizované stravovacie plány</h3>
          <p className="text-gray-700 mt-3">Upravte svoj jedálniček na základe vašich fitness cieľov.</p>
        </div>
      </div>

      {/* Vyhľadávací formulár */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Vyhľadajte informácie o výžive</h3>
        <div className="flex justify-center gap-4">
          <input
            type="text"
            placeholder="Zadajte názov jedla..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            disabled={disabled}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-950"
          >
            Hľadať
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
