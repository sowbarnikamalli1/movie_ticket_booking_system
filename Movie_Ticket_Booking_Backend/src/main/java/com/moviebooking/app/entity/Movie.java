package com.moviebooking.app.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Movie {
  @Id @GeneratedValue Long id;
  String title;
  String actor;
}
