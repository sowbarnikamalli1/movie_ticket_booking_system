import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, CreditCard, Mail, ShieldCheck, Ticket, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PAYMENT_OPTIONS = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'netbanking', label: 'Net Banking' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  const bookingSummary = useMemo(() => {
    if (!bookingState?.show || !Array.isArray(bookingState?.selectedSeats) || bookingState.selectedSeats.length === 0) {
      return null;
    }

    return {
      show: bookingState.show,
      selectedSeats: bookingState.selectedSeats,
      totalPrice: bookingState.totalPrice,
    };
  }, [bookingState]);

  if (!bookingSummary) {
    return (
      <div className="flow-card empty-state-card">
        <h2 className="flow-title">Payment details unavailable</h2>
        <p className="flow-subtitle">Choose seats first, then continue to payment.</p>
        <Link to="/" className="inline-link-btn">Back to shows</Link>
      </div>
    );
  }

  const { show, selectedSeats, totalPrice } = bookingSummary;
  const isSubmitDisabled = processing || !name.trim() || !email.trim();

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setPaymentMessage('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      setPaymentMessage('Please enter your email address.');
      return;
    }

    setProcessing(true);
    setPaymentMessage('Processing payment and reserving your seats...');

    try {
      await Promise.all(
        selectedSeats.map((seat) =>
          axios.post('http://localhost:8081/api/book', {
            showId: show.id,
            seat,
            name: name.trim(),
          })
        )
      );

      const bookingId = `CB-${show.id}-${Date.now().toString().slice(-6)}`;

      navigate('/ticket', {
        state: {
          ticket: {
            bookingId,
            customerName: name.trim(),
            email: email.trim(),
            paymentMethod,
            amount: totalPrice,
            seats: selectedSeats,
            bookedAt: new Date().toISOString(),
            show,
          },
        },
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Payment failed. Please try again.';
      setPaymentMessage(message);
      setProcessing(false);
    }
  };

  return (
    <div className="payment-layout">
      <div className="flow-card payment-card">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="me-2" />
          Back to seats
        </button>

        <h2 className="flow-title">Payment details</h2>
        <p className="flow-subtitle">Enter your details and complete payment to confirm the selected seats.</p>

        <form className="payment-form" onSubmit={handlePayment}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} className="me-2" />
              Name
            </label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} className="me-2" />
              Email
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label">
              <CreditCard size={16} className="me-2" />
              Payment Method
            </label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              {PAYMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="book-btn" disabled={isSubmitDisabled}>
            <ShieldCheck size={18} className="me-2" />
            {processing ? 'Processing payment...' : `Pay`}
          </button>
        </form>

        {paymentMessage && (
          <div className={`alert mt-3 ${paymentMessage.includes('Processing') ? 'alert-info' : 'alert-danger'}`}>
            {paymentMessage}
          </div>
        )}
      </div>

      <div className="flow-card summary-card">
        <h3 className="summary-title">Booking summary</h3>
        <div className="summary-stack">
          <div className="summary-chip">
            <span className="summary-chip-label">Movie</span>
            <span className="summary-chip-value">{show.movie.title}</span>
          </div>
          <div className="summary-chip">
            <span className="summary-chip-label">Actor</span>
            <span className="summary-chip-value">{show.movie.actor}</span>
          </div>
          <div className="summary-chip">
            <span className="summary-chip-label">Date</span>
            <span className="summary-chip-value">{show.date}</span>
          </div>
          <div className="summary-chip">
            <span className="summary-chip-label">Time</span>
            <span className="summary-chip-value">{show.time}</span>
          </div>
          <div className="summary-chip">
            <span className="summary-chip-label">Seats</span>
            <span className="summary-chip-value">{selectedSeats.join(', ')}</span>
          </div>
          <div className="summary-chip summary-chip-strong">
            <span className="summary-chip-label">Amount</span>
            <span className="summary-chip-value">₹{totalPrice}</span>
          </div>
        </div>
        <div className="alert alert-info mt-4 mb-0">
          <Ticket size={16} className="me-2" />
          Your ticket will be generated immediately after payment.
        </div>
      </div>
    </div>
  );
}