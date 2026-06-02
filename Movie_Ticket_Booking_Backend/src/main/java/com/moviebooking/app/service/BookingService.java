package com.moviebooking.app.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.moviebooking.app.entity.Booking;
import com.moviebooking.app.entity.Show;
import com.moviebooking.app.repository.BookingRepo;
import com.moviebooking.app.repository.ShowRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

  private static final String PAYMENT_PENDING = "PENDING";
  private static final String PAYMENT_PAID = "PAID";
  private static final int DUMMY_TICKET_PRICE = 200;

  private final BookingRepo bookingRepo;
  private final ShowRepo showRepo;

  public List<Integer> getBookedSeats(Long showId) {
    return bookingRepo.findByShowId(showId)
      .stream().map(Booking::getSeatNumber).toList();
  }

  @Transactional
  public Booking bookSeat(Long showId, int seat, String name,
                          String email, String paymentMethod, Integer amount) {

    Show show = showRepo.findById(showId).orElseThrow();

    int totalSeats = show.getScreen().getTotalSeats();
    int booked = bookingRepo.countByShowId(showId);

    if (booked >= totalSeats)
      throw new RuntimeException("Housefull! Choose another show");

    if (bookingRepo.existsByShowIdAndSeatNumber(showId, seat))
      throw new RuntimeException("Seat already booked!");

    Booking b = new Booking();
    b.setShow(show);
    b.setSeatNumber(seat);
    b.setUserName(name);
    b.setEmail(email);
    b.setPaymentStatus(PAYMENT_PENDING);
    b.setPaymentMethod(paymentMethod != null && !paymentMethod.isBlank() ? paymentMethod : "card");
    b.setAmount(amount != null ? amount : DUMMY_TICKET_PRICE);

    return bookingRepo.save(b);
  }

  @Transactional
  public Booking completeDummyPayment(Long bookingId, String paymentMethod) {
    Booking booking = bookingRepo.findById(bookingId).orElseThrow();

    if (PAYMENT_PAID.equals(booking.getPaymentStatus())) {
      return booking;
    }

    // Simulate payment-gateway latency (2 s)
    try { Thread.sleep(2000); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }

    // 90% success rate simulation — always succeeds for dummy; kept as hook for future
    booking.setPaymentStatus(PAYMENT_PAID);
    if (paymentMethod != null && !paymentMethod.isBlank()) {
      booking.setPaymentMethod(paymentMethod);
    }
    booking.setPaymentReference("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    booking.setTicketNumber("TKT-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());
    booking.setBookedAt(LocalDateTime.now());

    return bookingRepo.save(booking);
  }

  public Map<String, Object> getTicketDetails(Long bookingId) {
    Booking booking = bookingRepo.findById(bookingId).orElseThrow();

    if (!PAYMENT_PAID.equals(booking.getPaymentStatus())) {
      throw new RuntimeException("Payment not completed for this booking");
    }

    return toTicketDetails(booking);
  }

  public List<Map<String, Object>> getHistory(String userName) {
    return bookingRepo
      .findByUserNameIgnoreCaseAndPaymentStatusOrderByBookedAtDesc(userName, PAYMENT_PAID)
      .stream()
      .map(this::toTicketDetails)
      .toList();
  }

  private Map<String, Object> toTicketDetails(Booking booking) {
    Show show = booking.getShow();

    return Map.ofEntries(
      Map.entry("bookingId", booking.getId()),
      Map.entry("ticketNumber", booking.getTicketNumber()),
      Map.entry("userName", booking.getUserName()),
      Map.entry("email", booking.getEmail() != null ? booking.getEmail() : ""),
      Map.entry("seatNumber", booking.getSeatNumber()),
      Map.entry("amount", booking.getAmount()),
      Map.entry("paymentStatus", booking.getPaymentStatus()),
      Map.entry("paymentMethod", booking.getPaymentMethod()),
      Map.entry("paymentReference", booking.getPaymentReference()),
      Map.entry("bookedAt", booking.getBookedAt()),
      Map.entry("showId", show.getId()),
      Map.entry("showDate", show.getDate()),
      Map.entry("showTime", show.getTime()),
      Map.entry("movieTitle", show.getMovie().getTitle()),
      Map.entry("actor", show.getMovie().getActor()),
      Map.entry("screenName", show.getScreen().getName())
    );
  }
}
