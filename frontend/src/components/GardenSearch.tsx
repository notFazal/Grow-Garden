import React, { useState } from 'react';

export const GardenSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<string[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    if (!searchTerm) {
        setResults([]);
        return;
    }
    try {
        const response = await fetch(`http://localhost:5000/search_garden_name?prefix=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
        const data = await response.json();
        // data is a list of garden name strings
        setResults(data);
        }
    } catch (err) {
        console.error("Error searching garden name:", err);
    }
    };

    return (
    <div className="border p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Search Garden Name</h2>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input
            type="text"
            className="border p-2 flex-1"
            placeholder="Enter garden name prefix..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
            Search
        </button>
        </form>

        {results.length > 0 && (
        <div className="mt-4 bg-emerald-50 p-3 rounded">
        <h3 className="font-medium mb-2">Results:</h3>
        <ul className="list-disc list-inside">
            {results.map((name) => (
            <li key={name}>{name}</li>
            ))}
        </ul>
        </div>
    )}
    </div>
    );
};
