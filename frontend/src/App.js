
import './App.css';
// toastify ( for alerts )
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserWrapper from './components/wrapper/userwrapper';
function App() {
  return (
    <>
    <BrowserRouter>

        <Routes>
          <Route path='/*' element={<UserWrapper/>}/>
          
        </Routes>
    
    </BrowserRouter>
  


      {/* for toastify alert */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
