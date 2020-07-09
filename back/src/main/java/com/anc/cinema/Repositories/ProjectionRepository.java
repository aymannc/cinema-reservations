package com.anc.cinema.Repositories;

import com.anc.cinema.Entities.Projection;
import com.anc.cinema.Entities.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Collection;
import java.util.List;

@RepositoryRestResource
@CrossOrigin("*")
public interface ProjectionRepository extends JpaRepository<Projection, Long> {
    Collection<Projection> findBySalle(Salle salle);

    List<Projection> findAllBySalleId(Long id);
}
