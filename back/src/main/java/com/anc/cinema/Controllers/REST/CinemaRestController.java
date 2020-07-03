package com.anc.cinema.Controllers.REST;

import com.anc.cinema.Entities.Film;
import com.anc.cinema.Entities.Ticket;
import com.anc.cinema.Repositories.FilmRepository;
import com.anc.cinema.Repositories.TicketRepository;
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

    @GetMapping(path = "/image/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] image(@PathVariable(name = "id") Long id) throws IOException {
        Film film = filmRepository.getOne(id);
        File file = new File(UPLOADED_FOLDER + film.getPhoto());
        Path path = Paths.get(file.toURI());
        return Files.readAllBytes(path);
    }

    @GetMapping(path = "/image-by-name/{name}", produces = MediaType.IMAGE_JPEG_VALUE)
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

}

@Data
@ToString
class TicketsForm {
    private String nomClient;
    private Integer codePayment;
    private List<Long> tickets = new ArrayList<>();
}
