package com.moviebooking.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moviebooking.app.entity.Movie;

public interface MovieRepo extends JpaRepository<Movie, Long> {}
