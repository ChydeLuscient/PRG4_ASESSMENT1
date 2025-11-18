import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './components/templates/HeaderComponent';
import FooterComponent from './components/templates/FooterComponent';
import ListParkir from './components/parkir/ListParkir';
import ParkirMasuk from './components/parkir/ParkirMasuk';
import ParkirKeluar from './components/parkir/ParkirKeluar';
import ListJenis from './components/jenis/ListJenis';
import AddJenis from './components/jenis/AddJenis';


function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <HeaderComponent />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<ListParkir />} />
            <Route path="/add-parkir" element={<ParkirMasuk />} />
            <Route path="/parkir-keluar/:id" element={<ParkirKeluar />} />
            <Route path="/list-jenis" element={<ListJenis />} />
            <Route path="/add-jenis" element={<AddJenis />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;