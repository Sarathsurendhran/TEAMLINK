import React from "react";
import logo from "../../../assets/logo.png"

const OTP = ()=>{

  return(
    <>
    <div className="flex  justify-center min-h-screen bg-white">
      <div className="bg-white p-6 rounded-lg  max-w-xl w-full">
        <div className="-ml-10">
          <img
            src={logo}
            className="w-60 mx-auto"
          />
        </div>
      
          <h2 className="text-2xl md:text-5xl font-bold mb-7 mt-7 text-center">Check your email for a code</h2>

          <p className="text-lg text-center mb-5">We’ve sent a 6-character code to example@gmail.com. The code expires shortly, so please enter it soon.</p>

        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(4)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center border border-gray-500 rounded focus:outline-none focus:border-indigo-500"
            />
          ))}
        </div>
        <button className="mb-2 bg-[#7157FE] w-full text-white py-2 rounded hover:bg-indigo-600 transition-colors">Verify</button>
        <p> Didn't receive the code? <a href="#" className="text-indigo-500">Resend</a></p>
      </div>

    </div>
    </>
  )

}

export default OTP