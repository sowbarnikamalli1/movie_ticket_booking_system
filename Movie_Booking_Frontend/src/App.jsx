import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PaymentPage from './components/PaymentPage';
import ShowList from './components/ShowList';
import TicketPage from './components/TicketPage';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container-fluid px-4 py-4">
          <Routes>
            <Route path="/" element={<ShowList />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/ticket" element={<TicketPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
