import React from "react";
import ChatTextEditor from "./ChatTextEditor";

const Chat = () => {
  return (
    <>
      <div className="h-screen bg-[#1f1e1f] bottom-8 flex ml-auto max-w-[76rem] flex-col overflow-y-scroll">
        <div className=" flex-1 ">
          <div className="px-4 py-2">
            <div className="flex items-center mb-2 mt-36">
              <img
                className="w-8 h-8 rounded-full mr-2"
                src="https://picsum.photos/50/50"
                alt="User Avatar"
              />
              <div className="font-medium text-white ">John Doe</div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow mb-2 max-w-sm">
              Hi, how can I help you?
            </div>
            <div className="flex items-center text-white justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
                Sure, I can help with that.
              </div>
              <img
                className="w-8 h-8 rounded-full"
                src="https://picsum.photos/50/50"
                alt="User Avatar"
              />
            </div>
          </div>
        </div>
        {/* <div className="fixed bottom-0 left-0 right-0 bg-slate-700 border border-white px-4 py-2 max-w-[76rem] ml-auto">
          <div className="flex items-center justify-between">
          <input
          className="w-full md:w-auto border rounded-full py-2 px-4 mr-2 mb-2 md:mb-0"
          type="text"
          placeholder="Type your message..."
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full">
          Send
          </button>
          </div>
          </div> */}

        <ChatTextEditor />
      </div>
    </>
  );
};

export default Chat;
