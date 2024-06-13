import React from "react";
import logo from '../../assets/logo.png'  
import avatar1 from '../../assets/avatar1.svg'

const Workspaces = ()=>{

  return(
    <>
    <div className="flex justify-center min-h-screen bg-white">
      <div className="bg-white p-6  max-w-4xl w-full">
        <div className="-ml-10">
          <img
            src={logo}
            className="w-60 mx-auto"
          />
        </div>
        <h2 className="text-center mb-2 mt-4 text-2xl md:text-4xl font-bold ">Welcome back</h2>
        <p className="text-center mb-6  text-base">Choose a workspace below to get back to working with your team.</p>

        
        <div className="workspace w-full flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold">Workspaces for sarath500000@gmail.com</h3>
          <div className="w-full max-w-xl rounded-lg  bg-[#7157FE] mb-2 mt-2 h-16 transition cursor-pointer hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 "><h1>hello</h1></div>
          <div className="w-full max-w-xl rounded-lg  bg-[#7157FE] mb-2 mt-2 h-16 transition   cursor-pointer hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 "><h1>hello</h1></div>
          <div className="w-full max-w-xl rounded-lg  bg-[#7157FE] mb-2 mt-2 h-16 transition   cursor-pointer hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 "><h1>hello</h1></div>

          <div className="w-full max-w-xl rounded-lg  flex justify-between items-center bg-gray-200 mb-2 mt-2 h-16 ">
            <div >
              <img
                src={avatar1}
                className="ml-2 w-16 mx-auto"
              />
            </div>
              <p className="text-xs  ml-4 sm:ml-0 md:text-base">Want to use Slack with a different team?</p>
                <button className="px-2 py-2  bg-[#7157FE]  text-white rounded-lg  mr-2  transition cursor-pointer hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">Create another workspace</button>
          </div>
         
        </div>

      </div>
    </div>
    </>
  )

}

export default Workspaces