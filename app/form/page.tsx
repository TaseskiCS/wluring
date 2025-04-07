import React, {useState} from 'react'

const FormPage = () => {
    
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmit = async () => {
    setShowForm(true);
  }
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
                <div className='mt-4'>
                    <h1 className="text-3xl font-bold underline">Enter the OTP</h1>
                    <input type="text" placeholder="Enter OTP" className="border-2 border-gray-300 rounded-md p-2 mt-4" />
                </div>

                <button onClick={()=> setShowForm(false)}className='bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600 transition-all'>
                    Go Back
                </button>
            
            </>
        )}
    </div>
  )
}

export default FormPage