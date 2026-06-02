package com.moviebooking.app.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Booking {
  @Id @GeneratedValue Long id;

  @ManyToOne Show show;
  int seatNumber;
  String userName;
  String email;

  String paymentStatus;
  String paymentMethod;
  String paymentReference;
  String ticketNumber;
  Integer amount;
  LocalDateTime bookedAt;
}
