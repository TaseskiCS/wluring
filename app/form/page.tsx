"use client"

import React, {useState} from 'react'
import { RingItem } from "../types/RingItem";

const FormPage = () => {
  const [ringItem, setRingItem] = useState<RingItem>({
    username: "",
    displayName: "",
    url: "",
    grad_date: "",
  });
    
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
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
      setSubmitted(true);
    } catch (err) {
      setError("An error occurred while submitting the ring item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
        {!showForm && (
            <>
                <h1 className="text-3xl font-bold underline">Enter your Laurier Email</h1>
                <input type="text" placeholder="name####@mylaurier.ca"  value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-gray-300 rounded-md p-2 mt-4" />
                <div>{email}</div>

                <button onClick={()=>setShowForm(true)} className='bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600 transition-all'>
                    Send Verification Code
                </button>
            </>
        )}
        

        {showForm && (
    
            <>
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
        )}
    </div>
  )
}

export default FormPage