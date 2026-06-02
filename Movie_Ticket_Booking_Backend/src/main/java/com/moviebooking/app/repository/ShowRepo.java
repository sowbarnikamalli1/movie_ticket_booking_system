package com.moviebooking.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moviebooking.app.entity.Show;

public interface ShowRepo extends JpaRepository<Show, Long> {}