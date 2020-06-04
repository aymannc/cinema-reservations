package com.anc.cinema.Entities;

import org.springframework.data.rest.core.config.Projection;

import java.util.Collection;
import java.util.Date;

@Projection(name = "FilmProjection", types = com.anc.cinema.Entities.Projection.class)
public interface ProjectionProj {
    public Long getId();

    public double getPrix();

    public Date getDateProjection();

    public Salle getSalle();

    public Film getFilm();

    public Seance getSeance();

    public Collection<Ticket> getTickets();
}
