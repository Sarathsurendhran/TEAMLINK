import React, { useState, useRef } from 'react';
import logo from "../../../assets/logo.png" 
import axios  from 'axios'; 
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const OTPInput = () => {
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const inputRefs = useRef([]);
  const baseURL = process.env.REACT_APP_baseURL
  const navigate = useNavigate()
  const registrationEmail = sessionStorage.getItem('registrationEmail')

  const handleChange = (element, index) => {
    if (/^[0-9]$/.test(element.value)) {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      // Move focus to the next input box
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (element.value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const otpString = otp.join('');
    const formData = new FormData()
   
    formData.append('otp', otpString)
    formData.append('email', registrationEmail)

    try{
      const res = await axios.post(`${baseURL}user/verify-otp/`, formData)
      if(res.status == 200){
        navigate(
          '/login',
        )
        toast.success(res.data.message)
        return res

      }
    }
    catch(error){
      if(error.response.status === 400){
        
          toast.error(error.response.data.message)
        }
      else{
        console.log(error)
      }
      }
    }


  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full">
        <div className="-ml-10">
          <img src={logo} className="w-60 mx-auto" alt="Logo" />
        </div>

        <h2 className="text-2xl md:text-5xl font-bold mb-7 mt-7 text-center">
          Check your email for a code
        </h2>

        <p className="text-lg text-center mb-5">
          We’ve sent a 6-character code to example@gmail.com. The code expires
          shortly, so please enter it soon.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-4">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                className="w-12 h-12 text-center border border-gray-500 rounded focus:outline-none focus:border-indigo-500"
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button
            type="submit"
            className="mb-2 bg-[#7157FE] w-full text-white py-2 rounded hover:bg-indigo-600 transition-colors"
          >
            Verify
          </button>
        </form>
        <p>
          Didn't receive the code?{' '}
          <a href="#" className="text-indigo-500">
            Resend
          </a>
        </p>
      </div>
    </div>
  );
};

export default OTPInput;
