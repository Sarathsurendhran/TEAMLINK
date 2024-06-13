import React from "react";
import logo from '../../assets/logo.png'
import worklife from '../../assets/worklife.webp'

const CreateWorkSpace = ()=>{
  return(
    <>
     <div className="flex justify-center min-h-screen bg-white">
      <div className="bg-white p-6  max-w-5xl w-full">
        <div className="-ml-10">
          <img
            src={logo}
            className="w-60 mx-auto"
          />
        </div>

        <div className=" flex mt-7 flex-col sm:flex-row">

          <div className="flex w-full flex-col sm:w-1/2 ">
            <h2 className="text-4xl font-bold max-w-md">Create a new TeamLink workspace</h2>
            <p className="text-lg mb-2 mt-3 max-w-md  ">TeamLink gives your team a home — a place where they can talk and work together. To create a new workspace, click the button below.</p>
            <input
                className="w-full max-w-md  px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-400 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                type="text"
                placeholder="Workspace Name" 
              />
            <button className="w-full max-w-md mt-5 bg-[#7157FE] rounded-md text-white text-lg px-4 py-2 hover:bg-indigo-600">Create a Workspace</button>
            <p className=" max-w-md text-xs mt-3">By continuing, you’re agreeing to our Main Services Agreement, User Terms of Service, and Slack Supplemental Terms. Additional disclosures are available in our Privacy Policy and Cookie Policy.</p>
          </div>

          <div className="flex w-full   md:w-1/2  ">
            <img
              src={worklife}
              className=" hidden sm:block mx-auto"
            />
          </div>

        </div>
       
      </div>
    </div>
  
    </>
  )


}

export default CreateWorkSpace