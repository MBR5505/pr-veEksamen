import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import BeiteKart from './components/BeiteKart';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import CreateFlokk from './pages/CreateFlokk.jsx';


function App() {
  // ...
  return (
    <BrowserRouter>
      <div className='wrapper'>
        <Routes>
          <Route path="/" element={<BeiteKart />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/:id" element={<Profile/>} />
          <Route path="/logout" element={<Login/>} />
          <Route path="/CreateFlokk" element={<CreateFlokk/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;