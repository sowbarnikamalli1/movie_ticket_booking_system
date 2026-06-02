import React, { useMemo } from 'react';
import { ArrowLeft, Download, Mail, Ticket, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const formatPaymentMethod = (paymentMethod) => {
  const labels = {
    card: 'Credit/Debit Card',
    upi: 'UPI',
    wallet: 'Digital Wallet',
    netbanking: 'Net Banking',
  };

  return labels[paymentMethod] || paymentMethod;
};

export default function TicketPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;

  const downloadTicket = () => {
    if (!ticket) return;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${ticket.bookingId}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f3f4f6; padding: 24px; }
    .ticket { max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e5e7eb; }
    .ticket-header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: #ffffff; padding: 24px; }
    .ticket-body { padding: 24px; color: #111827; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .item { background: #f9fafb; border-radius: 14px; padding: 16px; }
    .label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 6px; }
    .value { font-size: 16px; font-weight: 700; }
    .footer { padding: 24px; border-top: 1px dashed #d1d5db; color: #4b5563; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <h1 style="margin: 0 0 8px;">CineBook Ticket</h1>
      <p style="margin: 0; opacity: 0.92;">Booking ID: ${ticket.bookingId}</p>
    </div>
    <div class="ticket-body">
      <div class="grid">
        <div class="item"><span class="label">Movie</span><span class="value">${ticket.show.movie.title}</span></div>
        <div class="item"><span class="label">Actor</span><span class="value">${ticket.show.movie.actor}</span></div>
        <div class="item"><span class="label">Date</span><span class="value">${ticket.show.date}</span></div>
        <div class="item"><span class="label">Time</span><span class="value">${ticket.show.time}</span></div>
        <div class="item"><span class="label">Screen</span><span class="value">${ticket.show.screen.name}</span></div>
        <div class="item"><span class="label">Seats</span><span class="value">${ticket.seats.join(', ')}</span></div>
        <div class="item"><span class="label">Name</span><span class="value">${ticket.customerName}</span></div>
        <div class="item"><span class="label">Email</span><span class="value">${ticket.email}</span></div>
        <div class="item"><span class="label">Payment</span><span class="value">${formatPaymentMethod(ticket.paymentMethod)}</span></div>
        <div class="item"><span class="label">Amount</span><span class="value">₹${ticket.amount}</span></div>
      </div>
    </div>
    <div class="footer">Booked at ${new Date(ticket.bookedAt).toLocaleString()}</div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ticket.bookingId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const bookedAtText = useMemo(() => {
    if (!ticket?.bookedAt) return '';
    return new Date(ticket.bookedAt).toLocaleString();
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="flow-card empty-state-card">
        <h2 className="flow-title">No booked ticket found</h2>
        <p className="flow-subtitle">Complete a booking to see your ticket here.</p>
        <Link to="/" className="inline-link-btn">Back to shows</Link>
      </div>
    );
  }

  return (
    <div className="ticket-page-layout">
      <div className="flow-card ticket-success-card">
        <div className="ticket-success-pill">
          <Ticket size={18} className="me-2" />
          Booking confirmed
        </div>
        <h2 className="flow-title">Your ticket is ready</h2>
        <p className="flow-subtitle">Payment completed successfully. Download the ticket or book another show.</p>

        <div className="ticket-sheet">
          <div className="ticket-sheet-header">
            <div>
              <span className="ticket-sheet-eyebrow">Booking ID</span>
              <h3>{ticket.bookingId}</h3>
            </div>
            <button type="button" className="download-btn" onClick={downloadTicket}>
              <Download size={18} className="me-2" />
              Download Ticket
            </button>
          </div>

          <div className="ticket-grid">
            <div className="summary-chip">
              <span className="summary-chip-label">Movie</span>
              <span className="summary-chip-value">{ticket.show.movie.title}</span>
            </div>
            <div className="summary-chip">
              <span className="summary-chip-label">Actor</span>
              <span className="summary-chip-value">{ticket.show.movie.actor}</span>
            </div>
            <div className="summary-chip">
              <span className="summary-chip-label">Date</span>
              <span className="summary-chip-value">{ticket.show.date}</span>
            </div>
            <div className="summary-chip">
              <span className="summary-chip-label">Time</span>
              <span className="summary-chip-value">{ticket.show.time}</span>
            </div>
            <div className="summary-chip">
              <span className="summary-chip-label">Screen</span>
              <span className="summary-chip-value">{ticket.show.screen.name}</span>
            </div>
            <div className="summary-chip">
              <span className="summary-chip-label">Seats</span>
              <span className="summary-chip-value">{ticket.seats.join(', ')}</span>
            </div>
            <div className="summary-chip">
              <span className="summary-chip-label">
                <User size={14} className="me-2" />
                Name
              </span>
              <span className="summary-chip-value">{ticket.customerName}</span>
            </div>
            <div className="summary-chip">
              <span className="summary-chip-label">
                <Mail size={14} className="me-2" />
                Email
              </span>
              <span className="summary-chip-value">{ticket.email}</span>
            </div>
            <div className="summary-chip">
              <span className="summary-chip-label">Payment Method</span>
              <span className="summary-chip-value">{formatPaymentMethod(ticket.paymentMethod)}</span>
            </div>
            <div className="summary-chip summary-chip-strong">
              <span className="summary-chip-label">Paid Amount</span>
              <span className="summary-chip-value">₹{ticket.amount}</span>
            </div>
          </div>

          <div className="ticket-footer-row">
            <span>Booked at {bookedAtText}</span>
            <span>{ticket.seats.length} seat(s)</span>
          </div>
        </div>

        <div className="ticket-actions">
          <button type="button" className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="me-2" />
            Back to shows
          </button>
        </div>
      </div>
    </div>
  );
}