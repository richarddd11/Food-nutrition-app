import React, { useState } from 'react'

const AddFluidForm = ({ selectedDate, onAddFluid }) => {
    const [fluidAmount, setFluidAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!fluidAmount) return;

        onAddFluid(Number(fluidAmount))
        setFluidAmount('')
    }
  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow mb-4">
    <h3 className="text-lg font-bold text-blue-700 mb-2">Pridať tekutiny</h3>
    <div className="mb-2">
      <label className="block text-gray-700">Množstvo (l):</label>
      <input type="number" value={fluidAmount} onChange={(e) => setFluidAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Zadaj množstvo v litroch" />
</div>
<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Pridať tekutiny
      </button>
    </form>
  )
}

export default AddFluidForm