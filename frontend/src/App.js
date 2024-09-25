
// toastify ( for alerts )
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserWrapper from "./components/wrapper/userwrapper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./Redux/userStore";
import AdminWrapper from "./components/wrapper/admin_wrapper";
import CheckingIsBlocked from "./components/wrapper/checking_isblocked";



function App() {
  
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes>
              <Route path="/*" element={<CheckingIsBlocked><UserWrapper /></CheckingIsBlocked>} />
              <Route path="/admin/*" element={<AdminWrapper/>} />
            </Routes>
          </PersistGate>
        </Provider>
      </BrowserRouter>

      {/* for toastify alert */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

    </>
  );
}

export default App;
