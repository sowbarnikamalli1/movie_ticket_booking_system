package com.moviebooking.app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moviebooking.app.entity.Booking;
import com.moviebooking.app.entity.Show;
import com.moviebooking.app.repository.ShowRepo;
import com.moviebooking.app.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {

  private final BookingService service;
  private final ShowRepo showRepo;

  @GetMapping("/shows")
  public List<Show> getShows() {
    return showRepo.findAll();
  }

  @GetMapping("/shows/{id}/seats")
  public Map<String, Object> seats(@PathVariable Long id) {
    List<Integer> booked = service.getBookedSeats(id);
    int total = showRepo.findById(id).get().getScreen().getTotalSeats();

    return Map.of("totalSeats", total, "bookedSeats", booked);
  }

  @PostMapping("/book")
  public Map<String, Object> book(@RequestBody Map<String, String> req) {
    String rawAmount = req.get("amount");
    Integer amount = rawAmount != null ? Integer.parseInt(rawAmount) : null;
    Booking booking = service.bookSeat(
      Long.parseLong(req.get("showId")),
      Integer.parseInt(req.get("seat")),
      req.get("name"),
      req.get("email"),
      req.get("paymentMethod"),
      amount
    );
    // Return only reservation confirmation — payment not processed yet
    return Map.of(
      "bookingId",    booking.getId(),
      "seatNumber",   booking.getSeatNumber(),
      "paymentStatus", booking.getPaymentStatus()
    );
  }

  @PostMapping("/payment/{bookingId}")
  public Map<String, Object> completePayment(
      @PathVariable Long bookingId,
      @RequestBody(required = false) Map<String, String> req) {
    String method = req == null ? null : req.get("method");
    service.completeDummyPayment(bookingId, method);
    return service.getTicketDetails(bookingId);
  }

  @GetMapping("/tickets/{bookingId}")
  public Map<String, Object> ticket(@PathVariable Long bookingId) {
    return service.getTicketDetails(bookingId);
  }

  @GetMapping("/history/{name}")
  public List<Map<String, Object>> history(@PathVariable String name) {
    return service.getHistory(name);
  }
}
