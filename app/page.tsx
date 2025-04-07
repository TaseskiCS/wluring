"use client";
import React, { useState, useEffect } from "react";
import { RingItem } from "./types/RingItem";

export default function Home() {
  const [ringItem, setRingItem] = useState<RingItem>({
    username: "",
    displayName: "",
    url: "",
    grad_date: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [ringItems, setRingItems] = useState<RingItem[]>([]);
  const [loading, setLoading] = useState(false);
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


  const handleSubmit = async () => {
    if (!ringItem.displayName || !ringItem.url || !ringItem.grad_date) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send the new data to the endpoint
      const response = await fetch("/api/createPR", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ringItem),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to submit the data.");
      }

      // Add the new ring item to the list

      setRingItems((prev) => [...prev, ringItem]); 

      // Clear

      setRingItem({
        username: "",
        displayName: "",
        url: "",
        grad_date: "",
      });
      setSubmitted(true);
    } catch (err) {
      setError("An error occurred while submitting the ring item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="flex justify-center h-screen items-center text-4xl font-bold">
        wluring: laurier's very own web ring!
      </h1>

      <div>
        <h2 className="text-xl font-semibold">Current Web Ring Items:</h2>
        <pre>{JSON.stringify(ringItems, null, 2)}</pre>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <input
            type="text"
            value={ringItem.username}
            onChange={(e) => setRingItem({ ...ringItem, username: e.target.value })}
            placeholder="Username"
            className="border-2 border-gray-300 rounded-md p-2 w-80"
        />
        <input
          type="text"
          value={ringItem.displayName}
          onChange={(e) => setRingItem({ ...ringItem, displayName: e.target.value })}
          placeholder="Name"
          className="border-2 border-gray-300 rounded-md p-2 w-80"
        />
        <input
          type="text"
          value={ringItem.url}
          onChange={(e) => setRingItem({ ...ringItem, url: e.target.value })}
          placeholder="URL"
          className="border-2 border-gray-300 rounded-md p-2 w-80"
        />
        <input
          type="text"
          value={ringItem.grad_date}
          onChange={(e) => setRingItem({ ...ringItem, grad_date: e.target.value })}
          placeholder="Graduation Date"
          className="border-2 border-gray-300 rounded-md p-2 w-80"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded-md p-2 w-80 hover:bg-blue-600 transition-all"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {submitted && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold">Successfully Submitted!</h2>
          <p>Username: {ringItem.username}</p>
          <p>Name: {ringItem.displayName}</p>
          <p>URL: {ringItem.url}</p>
          <p>Graduation Date: {ringItem.grad_date}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}
    </>
  );
}
