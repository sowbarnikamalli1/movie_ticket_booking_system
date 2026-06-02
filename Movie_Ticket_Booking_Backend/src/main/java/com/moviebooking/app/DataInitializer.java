package com.moviebooking.app;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.moviebooking.app.entity.Movie;
import com.moviebooking.app.entity.Screen;
import com.moviebooking.app.entity.Show;
import com.moviebooking.app.repository.MovieRepo;
import com.moviebooking.app.repository.ScreenRepo;
import com.moviebooking.app.repository.ShowRepo;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final MovieRepo movieRepo;
    private final ScreenRepo screenRepo;
    private final ShowRepo showRepo;

    @Override
    public void run(String... args) {
        if (movieRepo.count() > 0 || screenRepo.count() > 0 || showRepo.count() > 0) {
            return;
        }

        Movie movie1 = new Movie();
        movie1.setTitle("The Grand Premiere");
        movie1.setActor("Aarav Kapoor");

        Movie movie2 = new Movie();
        movie2.setTitle("Midnight Escape");
        movie2.setActor("Nina Shah");

        Movie movie3 = new Movie();
        movie3.setTitle("Sunrise Journey");
        movie3.setActor("Rohit Mehta");

        movieRepo.saveAll(List.of(movie1, movie2, movie3));

        Screen screen1 = new Screen();
        screen1.setName("Screen 1");
        screen1.setTotalSeats(40);

        Screen screen2 = new Screen();
        screen2.setName("Screen 2");
        screen2.setTotalSeats(30);

        Screen screen3 = new Screen();
        screen3.setName("Screen 3");
        screen3.setTotalSeats(25);

        screenRepo.saveAll(List.of(screen1, screen2, screen3));

        Show show1 = new Show();
        show1.setMovie(movie1);
        show1.setScreen(screen1);
        show1.setDate(LocalDate.now().plusDays(1));
        show1.setTime("11:00 AM");

        Show show2 = new Show();
        show2.setMovie(movie1);
        show2.setScreen(screen1);
        show2.setDate(LocalDate.now().plusDays(1));
        show2.setTime("06:00 PM");

        Show show3 = new Show();
        show3.setMovie(movie2);
        show3.setScreen(screen2);
        show3.setDate(LocalDate.now().plusDays(2));
        show3.setTime("02:30 PM");

        Show show4 = new Show();
        show4.setMovie(movie3);
        show4.setScreen(screen3);
        show4.setDate(LocalDate.now().plusDays(2));
        show4.setTime("08:00 PM");

        showRepo.saveAll(List.of(show1, show2, show3, show4));
    }
}
