import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';


function App() {

  return (
    <>
      <Router>
        <Navbar />
        <div className='container-fluid'>
          <AppRoutes />
        </div>
      </Router>
    </>
  )
}

export default App
