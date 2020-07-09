package com.anc.cinema.Controllers.REST;

import com.anc.cinema.Entities.*;
import com.anc.cinema.ICinemaInit.ICinemaService;
import com.anc.cinema.Repositories.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@Transactional
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CinemaRestController {
    final static String UPLOADED_FOLDER = System.getProperty("user.home") + "/Pictures/CinemaApp/images/";

    @Autowired
    FilmRepository filmRepository;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    CinemaRepository cinemaRepository;
    @Autowired
    VilleRepository villeRepository;
    @Autowired
    ICinemaService cinemaService;
    @Autowired
    ProjectionRepository projectionRepository;
    @Autowired
    SeanceRepository seanceRepository;
    @Autowired
    SalleRepository salleRepository;

    @GetMapping(path = "/image/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] image(@PathVariable(name = "id") Long id) throws IOException {
        Film film = filmRepository.getOne(id);
        File file = new File(UPLOADED_FOLDER + film.getPhoto());
        Path path = Paths.get(file.toURI());
        return Files.readAllBytes(path);
    }

    @GetMapping(path = "/image-by-name/{name:.+}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] imageByPath(@PathVariable(name = "name") String name) {
        File file = new File(UPLOADED_FOLDER + name);
        Path path = Paths.get(file.toURI());
        try {
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Didn't found an image with that name!"
            );
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile uploadfile) {
        if (uploadfile.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "please select a file!"
            );
        }
        try {
            String slug = (new Date().getTime() / 1000) + uploadfile.getOriginalFilename();
            slug = slug.replace(" ", "_");
            byte[] bytes = uploadfile.getBytes();
            File dir = new File(UPLOADED_FOLDER);
            if (!dir.exists()) dir.mkdirs();
            Path path = Paths.get(UPLOADED_FOLDER + slug);
            Files.write(path, bytes);
            return new ResponseEntity(slug, new HttpHeaders(), HttpStatus.OK);

        } catch (IOException e) {
            System.out.println(e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Problems saving the image"
            );
        }
    }


    @PostMapping(path = "/buyTickets")
    public List<Ticket> buyTickets(@RequestBody TicketsForm ticketsForm) {
        List<Ticket> ticketList = new ArrayList<>();
        ticketsForm.getTickets().forEach(ticketId -> {
            System.out.println(ticketId);
            Ticket ticket = ticketRepository.findById(ticketId).get();
            ticket.setNomClient(ticketsForm.getNomClient());
            ticket.setReserve(true);
            ticket.setCodePayment(ticketsForm.getCodePayment());
            ticketRepository.save(ticket);
            ticketList.add(ticket);
        });
        return ticketList;
    }

    @PostMapping(path = "/addFilm")
    public ResponseEntity<Film> addFilm(@RequestPart("filmData") Film filmData,
                                        @RequestPart("file") MultipartFile file) {
        String path = this.uploadFile(file).getBody().toString();
        filmData.setPhoto(path);
        Film film = filmRepository.save(filmData);
        if (film != null) {
            return new ResponseEntity(film, HttpStatus.OK);
        } else throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, "Problems saving the film"
        );
    }


    @PostMapping(path = "/modifyMovie")
    public ResponseEntity<Film> modifyFilm(@RequestPart("filmData") Film filmData,
                                           @RequestPart(value = "file", required = false) MultipartFile file) {

        if (!filmRepository.findById(filmData.getId()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Can't find this film");
        }
        if (file != null) {
            filmData.setPhoto(this.uploadFile(file).getBody().toString());
        }
        return new ResponseEntity<>(filmRepository.save(filmData), HttpStatus.OK);

    }

    @PostMapping(path = "/addCinema")
    public ResponseEntity<Boolean> addCinema(@RequestBody CinemaForm cinemaForm) {
        Ville ville = villeRepository.findById(cinemaForm.getCity()).orElse(null);
        if (ville == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Didn't found this city"
            );
        }
        Cinema cinema = new Cinema(null, cinemaForm.getName(),
                cinemaForm.getLongitude(), cinemaForm.getLatitude(),
                cinemaForm.getAltitude(), cinemaForm.getNbrRooms(),
                null, ville);
        cinema = cinemaRepository.save(cinema);

        cinemaService.randomInitCinemaRooms(cinema, cinemaForm.getInit());
        return new ResponseEntity<>(true, HttpStatus.OK);

    }

    @PostMapping(path = "/updateProjections")
    public ResponseEntity<Boolean> updateProjections(@RequestBody ProjectionsForm projectionsForm) throws ParseException {
        Film film = filmRepository.findById(projectionsForm.getMovieID()).orElse(null);
        Salle salle = salleRepository.findById(projectionsForm.getRoomID()).orElse(null);
        if (film == null || salle == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Didn't found this " + (film == null ? "Film" : "Room")
            );
        }
        projectionRepository.deleteAll(salleRepository.getOne(salle.getId()).getProjections());

        DateFormat dateFormat = new SimpleDateFormat("HH:mm");
        for (ProjectionItem projectionItem : projectionsForm.getProjections()) {
            Projection projection = new Projection();
            Seance seance = new Seance();
            seance.setHeureDebut(dateFormat.parse(projectionItem.getDate()));
            seance = seanceRepository.save(seance);
            projection.setSeance(seance);
            projection.setDateProjection(new Date());
            projection.setFilm(film);
            projection.setPrix(projectionItem.getPrice());
            projection.setSalle(salle);
            projection.setSeance(seance);
            projection = projectionRepository.save(projection);cinemaService.initTicket(projection);
        }
        return new ResponseEntity<>(true, HttpStatus.OK);
    }
}

@Data
@ToString
class TicketsForm {
    private String nomClient;
    private Integer codePayment;
    private List<Long> tickets = new ArrayList<>();
}

@Data
@ToString
class CinemaForm {
    private Boolean init;
    private String name;
    private double longitude, latitude, altitude;
    private int nbrRooms;
    private Long city;
}

@ToString
class ProjectionsForm {
    private long movieID;
    private long roomID;
    private ProjectionItem[] projections;

    @JsonProperty("movieId")
    public long getMovieID() {
        return movieID;
    }

    @JsonProperty("movieId")
    public void setMovieID(long value) {
        this.movieID = value;
    }

    @JsonProperty("roomId")
    public long getRoomID() {
        return roomID;
    }

    @JsonProperty("roomId")
    public void setRoomID(long value) {
        this.roomID = value;
    }

    @JsonProperty("projections")
    public ProjectionItem[] getProjections() {
        return projections;
    }

    @JsonProperty("projections")
    public void setProjections(ProjectionItem[] value) {
        this.projections = value;
    }
}

@ToString
class ProjectionItem {
    private String date;
    private long price;

    @JsonProperty("date")
    public String getDate() {
        return date;
    }

    @JsonProperty("date")
    public void setDate(String value) {
        this.date = value;
    }

    @JsonProperty("price")
    public long getPrice() {
        return price;
    }

    @JsonProperty("price")
    public void setPrice(long value) {
        this.price = value;
    }
}
