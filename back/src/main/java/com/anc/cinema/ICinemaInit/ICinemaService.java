package com.anc.cinema.ICinemaInit;

import com.anc.cinema.Entities.Cinema;
import com.anc.cinema.Entities.Projection;

public interface ICinemaService {
    public void initVilles();

    public void initCinemas();

    public void initSalles();

    public void initPlaces();

    public void initSeances();

    public void initCategories();

    public void initFilms();

    public void initProjections();

    public void initTickets();

    public void initTicket(Projection projection);

    public void randomInitCinemaRooms(Cinema cinema, Boolean init);
}
