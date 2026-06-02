import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRICE_PER_TICKET = 150;
const MAX_TICKETS = 6;

export default function SeatBooking({ show }) {
  const navigate = useNavigate();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  const { id: showId, screen } = show;
  const totalSeats = screen.totalSeats;

  const loadSeats = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/shows/${showId}/seats`);
      setBookedSeats(response.data.bookedSeats || []);
      setError('');
    } catch {
      setError('Unable to load seat availability.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeats();
    const interval = setInterval(loadSeats, 3000);
    return () => clearInterval(interval);
  }, [showId]);

  const availableSeats = useMemo(() => {
    return [...Array(totalSeats)].map((_, index) => index + 1);
  }, [totalSeats]);

  const seatsRemaining = totalSeats - bookedSeats.length;
  const maxSelectableSeats = Math.min(MAX_TICKETS, seatsRemaining);
  const ticketCount = selectedSeats.length;

  const handleToggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setPaymentMessage('');
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
      return;
    }

    if (selectedSeats.length >= maxSelectableSeats) {
      setPaymentMessage(`You can select a maximum of ${maxSelectableSeats} seats for this booking.`);
      return;
    }

    setPaymentMessage('');
    setSelectedSeats([...selectedSeats, seat]);
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setPaymentMessage('Please select at least one seat.');
      return;
    }

    navigate('/payment', {
      state: {
        show,
        selectedSeats,
        totalPrice,
      },
    });
  };

  const totalPrice = selectedSeats.length * PRICE_PER_TICKET;

  return (
    <div className="seat-booking">
      <h5>Choose Your Seats</h5>

      {loading && (
        <div className="alert alert-info">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Loading seat availability...
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="booking-summary">
        <div className="summary-item">
          <span className="summary-label">Tickets Selected</span>
          <span className="summary-value">{ticketCount} / {maxSelectableSeats}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Available Seats</span>
          <span className="summary-value">{seatsRemaining}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Price</span>
          <span className="summary-value">₹{totalPrice}</span>
        </div>
      </div>

      <div className="mb-4">
        <h6 className="mb-3" style={{ color: '#ffffff' }}>Select Your Seats</h6>
        <div className="seat-grid">
          {availableSeats.map(seat => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);
            return (
              <button
                key={seat}
                type="button"
                className={`seat-button ${isBooked ? 'booked' : isSelected ? 'selected' : ''}`}
                disabled={isBooked}
                onClick={() => handleToggleSeat(seat)}
                title={isBooked ? 'Booked' : isSelected ? 'Selected' : `Seat ${seat}`}
              >
                {seat}
              </button>
            );
          })}
        </div>

        <div className="mt-3 d-flex justify-content-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '20px', height: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px' }}></div>
            <span style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Available</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '20px', height: '20px', background: 'linear-gradient(45deg, #ff6b35, #f7931e)', borderRadius: '4px' }}></div>
            <span style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Selected</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '20px', height: '20px', background: 'rgba(220, 38, 38, 0.2)', border: '2px solid #dc2626', borderRadius: '4px' }}></div>
            <span style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>Booked</span>
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mb-4">
          <div className="alert alert-info">
            <Ticket size={16} className="me-2" />
            <strong>Selected Seats:</strong> {selectedSeats.join(', ')}
          </div>
        </div>
      )}

      <button
        className="book-btn"
        onClick={proceedToPayment}
        disabled={selectedSeats.length === 0}
      >
        <ArrowRight size={18} className="me-2" />
        Confirm Ticket
      </button>

      {paymentMessage && (
        <div className={`alert mt-3 ${paymentMessage.includes('complete') ? 'alert-success' : paymentMessage.includes('Processing') ? 'alert-info' : 'alert-danger'}`}>
          {paymentMessage}
        </div>
      )}
    </div>
  );
}