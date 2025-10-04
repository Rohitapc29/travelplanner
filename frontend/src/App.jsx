import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HotelsPage from './pages/hotels/HotelsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hotels" element={<HotelsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
