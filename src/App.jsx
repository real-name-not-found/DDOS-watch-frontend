import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import GlobalMap from './pages/GlobalMap';
import IpAnalyzer from './pages/IpAnalyzer';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme="dark"
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<GlobalMap />} />
          <Route path="/ip-analyzer" element={<IpAnalyzer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
