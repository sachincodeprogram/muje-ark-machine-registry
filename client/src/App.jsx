import { Route, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import RegisterSalePage from './pages/RegisterSalePage';
import SearchMachinePage from './pages/SearchMachinePage';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<RegisterSalePage />} />
          <Route path="/search" element={<SearchMachinePage />} />
          <Route path="*" element={<RegisterSalePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
