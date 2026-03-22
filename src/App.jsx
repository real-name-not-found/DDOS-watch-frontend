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
        hideProgressBar={false}
        theme="dark"
        icon={({ type }) => {
          const icons = {
            success: { icon: 'check', color: '#48BB78' },
            error: { icon: 'close', color: '#FC8181' },
            warning: { icon: 'priority_high', color: '#F6AD55' },
            info: { icon: 'arrow_forward', color: '#ffffff' },
            default: { icon: 'arrow_forward', color: '#ffffff' },
          };
          const { icon, color } = icons[type] || icons.default;
          return (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20, color, fontVariationSettings: "'FILL' 0, 'wght' 400" }}
            >
              {icon}
            </span>
          );
        }}
        closeButton={false}
        toastClassName="custom-toast"
        progressClassName="custom-toast-progress"
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
