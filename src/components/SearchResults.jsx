import React from "react";
import Spinner from "./Spinner";

const SearchResults = ({ results = [], query, setQuery, handleSearch, searchTerm, error, isLoading }) => {

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gray-100 text-gray-900 py-12 flex justify-center items-center">
        <Spinner />
      </section>
    );
  }
  
  return (
    <section className="min-h-screen bg-gray-100 text-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {error && (
          <p className="text-red-600 text-center mb-4">Chyba pri načítaní dát: {error.message}</p>
        )}

        <h2 className="text-3xl font-semibold text-green-700 text-center mb-6 mt-6">
          Výsledky pre: <em className="font-normal text-green-600">{searchTerm}</em>
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Zadaj iné jedlo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Hľadať
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((item, index) => {
              const { food_name, nutrition } = item;
              const image = nutrition?.photo?.thumb || "https://via.placeholder.com/300x150";
              const calories = nutrition?.nf_calories ?? 0;
              const fat = nutrition?.nf_total_fat ?? 0;
              const protein = nutrition?.nf_protein ?? 0;
              const carbs = nutrition?.nf_total_carbohydrate ?? 0;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition p-5"
                >
                  <img src={image} alt={food_name} className="w-full h-40 object-cover rounded-md" />
                  <h3 className="text-xl font-bold text-gray-800 mt-3">{food_name}</h3>
                  <div className="text-gray-600 text-sm leading-relaxed mt-2">
                    <p><strong className="text-green-600">Kalórie:</strong> {calories} kcal</p>
                    <p><strong className="text-green-600">Tuky:</strong> {fat} g</p>
                    <p><strong className="text-green-600">Bielkoviny:</strong> {protein} g</p>
                    <p><strong className="text-green-600">Sacharidy:</strong> {carbs} g</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-600">
              Žiadne výsledky na zobrazenie.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
