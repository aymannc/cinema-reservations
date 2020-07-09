package com.anc.cinema.ICinemaInit;

import com.anc.cinema.Entities.*;
import com.anc.cinema.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Stream;

@Service
@Transactional
public class CinemaServiceImpl implements ICinemaService {
    @Autowired
    VilleRepository villeRepository;
    @Autowired
    CinemaRepository cinemaRepository;
    @Autowired
    SalleRepository salleRepository;
    @Autowired
    PlaceRepository placeRepository;
    @Autowired
    SeanceRepository seanceRepository;
    @Autowired
    CategorieRepository categorieRepository;
    @Autowired
    FilmRepository filmRepository;
    @Autowired
    ProjectionRepository projectionRepository;
    @Autowired
    TicketRepository ticketRepository;

    double[] prices = new double[]{30, 50, 60, 70, 90, 100};

    @Override
    public void initVilles() {
        Stream.of("Casablanca", "Agadir", "Rabat", "Tanger").forEach(v -> {
            Ville ville = new Ville();
            ville.setName(v);
            villeRepository.save(ville);
        });
    }

    @Override
    public void initCinemas() {
        villeRepository.findAll().forEach(v -> {
            Stream.of("MegaMara", "IMAX", "RIOALTO", "Colisée").forEach(name -> {
                Cinema cinema = new Cinema();
                cinema.setName(name);
                cinema.setNombreSales(3 + (int) (Math.random() * 6));
                cinema.setVille(v);
                cinemaRepository.save(cinema);
            });
        });

    }

    @Override
    public void initSalles() {
        cinemaRepository.findAll().forEach(this::initSalle);
    }

    @Override
    public void initPlaces() {
        salleRepository.findAll().forEach(this::initPlace);
    }

    private void initPlace(Salle salle) {
        for (int i = 1; i <= salle.getNombrePlace(); i++) {
            Place place = new Place();
            place.setNumero(i);
            place.setSalle(salle);
            placeRepository.save(place);
        }
    }

    @Override
    public void initSeances() {
        DateFormat dateFormat = new SimpleDateFormat("HH:mm");
        Stream.of("12:00", "15:00", "17:00", "19:00", "21:00", "23:00").forEach(s -> {
            Seance seance = new Seance();
            try {
                seance.setHeureDebut(dateFormat.parse(s));
                seanceRepository.save(seance);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        });
    }

    @Override
    public void initCategories() {
        Stream.of("Action", "Drama", "Comedy", "Fiction", "Crime").forEach(category -> {
            Categorie categorie = new Categorie();
            categorie.setName(category);
            categorieRepository.save(categorie);
        });
    }

    @Override
    public void initFilms() {
        String[] titles = {"12 Angry Men", "Interstellar", "Saving Private Ryan", "Joker", "The Intouchables"};
        String[] categories = {"Drama", "Fiction", "Drama", "Crime", "Comedy"};
        String[] descriptions = {"A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.", "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.", "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.", "After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver."};
        String[] photos = {"https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SY1000_CR0,0,649,1000_AL_.jpg", "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_SX675_AL_.jpg", "https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SY1000_CR0,0,679,1000_AL_.jpg", "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg", "https://m.media-amazon.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_SY1000_CR0,0,674,1000_AL_.jpg"};
        int[] durations = {96, 169, 169, 122, 112};
        double[] ratings = {8.9, 8.6, 8.6, 8.5, 8.5};
        for (int i = 0; i < titles.length; i++) {
            Film film = new Film();
            film.setTitre(titles[i]);
            film.setDescription(descriptions[i]);
//            film.setPhoto(photos[i]);
            film.setPhoto(titles[i] + ".jpg");
            film.setDure(durations[i]);
            film.setRating(ratings[i]);
            film.setCategorie(categorieRepository.findCategorieByName(categories[i]));
            filmRepository.save(film);
        }
    }

    @Override
    public void initProjections() {
        List<Film> films = filmRepository.findAll();
        villeRepository.findAll().forEach(ville -> {
            ville.getCinemas().forEach(cinema -> {
                cinema.getSalles().forEach(salle -> {
                    initProjection(salle, films);
                });
            });
        });

    }

    @Override
    public void initTickets() {
        projectionRepository.findAll().forEach(this::initTicket);
    }

    @Override
    public void initTicket(Projection projection) {
        projection.getSalle().getPlaces().forEach(place -> {
            Ticket ticket = new Ticket();
            ticket.setPlace(place);
            ticket.setProjection(projection);
            ticket.setPrix(projection.getPrix());
            ticket.setReserve(false);
            ticketRepository.save(ticket);
        });

    }

    @Override
    public void randomInitCinemaRooms(Cinema cinema, Boolean init) {
        if (cinema == null)
            cinema = cinemaRepository.getOne((long) 1);
        initSalle(cinema);
        salleRepository.findByCinema(cinema).forEach(this::initPlace);
        if (init != null) {
            List<Film> films = filmRepository.findAll();
            salleRepository.findByCinema(cinema).forEach(salle -> {
                List<Projection> projections = this.initProjection(salle, films);
                projections.forEach(projection -> {
                    placeRepository.findBySalleId(salle.getId()).forEach(place -> {
                        Ticket ticket = new Ticket();
                        ticket.setPlace(place);
                        ticket.setProjection(projection);
                        ticket.setPrix(projection.getPrix());
                        ticket.setReserve(false);
                        ticketRepository.save(ticket);
                    });
                });
            });
        }


    }

    private List<Projection> initProjection(Salle salle, List<Film> films) {
        List<Projection> projections = new ArrayList();
        int randFilm = new Random().nextInt(films.size());
        seanceRepository.findAll().forEach(seance -> {
            Projection projection = new Projection();
            projection.setDateProjection(new Date());
            projection.setFilm(films.get(randFilm));
            projection.setPrix(this.prices[new Random().nextInt(prices.length)]);
            projection.setSalle(salle);
            projection.setSeance(seance);
            projections.add(projectionRepository.save(projection));
        });
        return projections;
    }

    private void initSalle(Cinema cinema) {
        for (int i = 0; i < cinema.getNombreSales(); i++) {
            Salle salle = new Salle();
            salle.setName("Salle " + (i + 1));
            salle.setNombrePlace(15 + (int) (Math.random() * 15));
            salle.setCinema(cinema);
            salleRepository.save(salle);
        }
    }
}
