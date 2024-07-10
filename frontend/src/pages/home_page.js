import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <header className="flex justify-between p-6">
        <div className="container mx-auto flex justify-around  items-center">
          {/* <h1 className="text-white text-3xl font-bold">TeamSync</h1> */}
          <div className="flex"></div>
          <div className="flex"></div>
          <div className="flex"></div>
          <div className="flex"></div>
          {/* This pushes the button to the right */}
          <div className="flex text-white ">
            <Link
              to="/register"
              className="ml-auto px-6 py-3 bg-[#7157FE] text-white font-semibold rounded-sm hover:bg-blue-700"
            >
              SignUp
            </Link>
          </div>
        </div>
      </header>

      <section className="py-10 ">
        <div className="container mx-auto text-left px-4 md:px-12">
          <h2 className="text-5xl font-bold font-serif  mb-4">
            Welcome to TeamLink
          </h2>
          <p className="text-gray-100 mb-8 font-mono">
            Streamline your team's communication and collaboration with our
            powerful platform.
          </p>
          <Link
            to="/register"
            className="bg-[#7157FE] text-white py-2 px-4 rounded-full hover:bg-purple-700 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section id="features" className="py-7">
        <div className="container mx-auto px-4 md:px-12 ">
          {/* <div className="-ml-10">
              <img src={logo} className="w-60 mx-auto" />
            </div> */}
          <h2 className="text-4xl font-bold text-center font-serif text-white mb-8">
            Features
          </h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 font-serif text-black">
                  Real-Time Messaging
                </h3>
                <p className="text-black text-lg">
                  Communicate with your team in real-time with our seamless
                  messaging system.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 font-serif text-black">
                  File Sharing
                </h3>
                <p className="text-black text-lg">
                  Easily share files and documents with your team, ensuring
                  everyone has the resources they need.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 font-serif text-black">
                  Task Management
                </h3>
                <p className="text-black text-lg">
                  Organize and assign tasks to team members, track progress, and
                  meet deadlines efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-between bg-[rgba(58,58,58,0.35)]  p-6 py-9"></div>

      <section id="pricing" className="bg-stone-900 py-20">
        {/* <div className="bg-[rgba(185,184,212,0.59)] container mx-auto text-center px-4 md:px-12"> */}
        <h2 className="text-4xl font-bold text-white mb-8 mt-3 font-serif">
          Our Plans
        </h2>
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg h-full">
              <h3 className="text-2xl font-bold mb-4 font-serif text-black">
                Basic Plan
              </h3>
              <p className="text-gray-700 mb-4">
                Essential features for small teams.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Task Management</li>
                <li>Basic Collaboration Tools</li>
                <li>Email Support</li>
              </ul>
              <p className="text-gray-600 italic">
                "The way to get started is to quit talking and begin doing." -
                Walt Disney
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg h-full">
              <h3 className="text-2xl font-bold mb-4 font-serif text-black">
                Pro Plan
              </h3>
              <p className="text-gray-700 mb-4">
                Advanced features for growing teams.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Advanced Task Management</li>
                <li>Real-time Collaboration</li>
                <li>Priority Email Support</li>
              </ul>
              <p className="text-gray-600 italic">
                "The key is not to prioritize what’s on your schedule, but to
                schedule your priorities." - Stephen Covey
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg h-full">
              <h3 className="text-2xl font-bold mb-4 font-serif text-black">
                Enterprise Plan
              </h3>
              <p className="text-gray-700 mb-4">
                Comprehensive features for large organizations.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>All Pro Plan Features</li>
                <li>Custom Integrations</li>
                <li>Dedicated Account Manager</li>
              </ul>
              <p className="text-gray-600 italic">
                "Efficiency is doing things right; effectiveness is doing the
                right things." - Peter Drucker
              </p>
            </div>
          </div>
        </div>
        {/* </div> */}
      </section>

      <footer className="bg-[#7157FE] py-6">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 TeamLink. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
