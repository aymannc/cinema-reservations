package com.anc.cinema.Repositories;

import com.anc.cinema.Entities.Cinema;
import com.anc.cinema.Entities.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Collection;

@RepositoryRestResource
@CrossOrigin("*")
public interface SalleRepository extends JpaRepository<Salle, Long> {
    Collection<Salle> findByCinema(Cinema cinema);
}
