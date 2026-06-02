package com.moviebooking.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moviebooking.app.entity.Booking;

public interface BookingRepo extends JpaRepository<Booking, Long> {
  List<Booking> findByShowId(Long showId);
  List<Booking> findByUserNameIgnoreCaseAndPaymentStatusOrderByBookedAtDesc(String userName, String paymentStatus);

  boolean existsByShowIdAndSeatNumber(Long showId, int seatNumber);
  int countByShowId(Long showId);
}