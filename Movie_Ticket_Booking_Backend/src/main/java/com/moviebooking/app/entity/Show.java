package com.moviebooking.app.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Show {
  @Id @GeneratedValue Long id;

  @ManyToOne Movie movie;
  @ManyToOne Screen screen;

  LocalDate date;
  String time;
}
