"use client";
import React, { useState, useEffect } from "react";
import { RingItem } from "./types/RingItem";
import FormPage from "./form/page";

export default function Home() {
  const [ringItems, setRingItems] = useState<RingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // fetch existing RingItems 
  useEffect(() => {
    const fetchRingItems = async () => {
      try {
        const response = await fetch("/RingItems.json");
        const data = await response.json();
        setRingItems(data);
      } catch (err) {
        console.error("Error fetching ring items", err);
        setError("Error fetching ring items.");
      }
    };

    fetchRingItems();
  }, []);


  return (
    <>
      <h1 className="flex justify-center h-screen items-center text-4xl font-bold">
        wluring: laurier's very own web ring!
      </h1>

      <div>
        <h2 className="text-xl font-semibold">Current Web Ring Items:</h2>
        <pre>{JSON.stringify(ringItems, null, 2)}</pre>
      </div>

      <a href='/form'>
        <button className="bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600 transition-all">
          Add yourself to the ring!
        </button>
      </a>
    </>
  );
}
