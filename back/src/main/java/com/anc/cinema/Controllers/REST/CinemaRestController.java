package com.anc.cinema.Controllers.REST;

import com.anc.cinema.Entities.Film;
import com.anc.cinema.Entities.Ticket;
import com.anc.cinema.Repositories.FilmRepository;
import com.anc.cinema.Repositories.TicketRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@Transactional
@CrossOrigin("*")
public class CinemaRestController {
    @Autowired
    FilmRepository filmRepository;
    @Autowired
    TicketRepository ticketRepository;

    @GetMapping(path = "/image/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] image(@PathVariable(name = "id") Long id) throws IOException {
        Film film = filmRepository.getOne(id);
        File file = new File(System.getProperty("user.home") +
                "/Pictures/CinemaApp/images/" + film.getPhoto());
        Path path = Paths.get(file.toURI());
        return Files.readAllBytes(path);
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

}

@Data
@ToString
class TicketsForm {
    private String nomClient;
    private Integer codePayment;
    private List<Long> tickets = new ArrayList<>();
}