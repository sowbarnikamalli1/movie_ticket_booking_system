package com.moviebooking.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moviebooking.app.entity.Screen;

public interface ScreenRepo extends JpaRepository<Screen, Long> {
}
