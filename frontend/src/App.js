
import './App.css';
// toastify ( for alerts )
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserWrapper from './components/wrapper/userwrapper';
import { Provider } from 'react-redux';
import userStore from './Redux/userStore';

function App() {
  return (
    <>
    <BrowserRouter>
      <Provider store={userStore}>
        <Routes>
          <Route path='/*' element={<UserWrapper/>}/>
          
        </Routes>
      </Provider>
    
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