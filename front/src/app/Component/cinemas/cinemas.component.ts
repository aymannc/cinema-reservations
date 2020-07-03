import {Component, OnInit} from '@angular/core';
import {CinemaService} from '../../Service/cinema.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-cinemas',
  templateUrl: './cinemas.component.html',
  styleUrls: ['./cinemas.component.css']
})
export class CinemasComponent implements OnInit {

  citiesOptions: Array<{ id: number; city: string; cinemas: string }> = [];
  selectedCity = null;
  isLoading = false;
  isLoadingSalles = false;
  cinemas = null;
  selectedCinema = null;
  listSalles = null;
  cardIndexes: number[];
  selectedProjection = null;
  ticketCart: number[] = [];
  selectdSalle = null;
  fullName: string;
  paymentNumber: string;
  isLoadingTickets: boolean;
  isAddCityModalVisible = false;
  isOkCityModalLoading = false;

  constructor(public cinemaService: CinemaService, private message: NzMessageService) {
  }

  errorFunc = (error) => {
    this.isLoading = false;
    this.isLoadingSalles = false;
    this.isLoadingTickets = false;
    console.log(error);
    this.message.error('Error');
  }

  resetData() {
    // this.isLoading = true;
    this.isLoadingSalles = false;
    this.cinemas = null;
    this.selectedCinema = null;
    this.listSalles = null;
    this.cardIndexes = [];
    this.selectedProjection = null;
    this.ticketCart = [];
  }

  ngOnInit(): void {
    this.getCities();
  }

  onSelectCity() {
    // Todo : Check the reset Data
    console.log(this.selectedCity);
    this.resetData();
    this.getCinemas();
  }

  onSelectCinema() {
    console.log(this.selectedCinema);
    this.isLoadingSalles = true;
    this.listSalles = null;
    this.cinemaService.getSalles(this.selectedCinema).subscribe(result => {

      this.isLoading = false;
      // @ts-ignore
      this.listSalles = result._embedded.salles;
      this.cardIndexes = new Array(this.listSalles.length).fill(0);
      this.listSalles.forEach(salle => {
        this.cinemaService.getProjection(salle).subscribe(projection => {
          // @ts-ignore
          salle.projections = projection._embedded.projections;
          salle.projections.forEach(proj => {
            proj.tickets.forEach(ticket => {
              ticket.selected = false;
            });
          });
          this.isLoadingSalles = false;
        });
      }, this.errorFunc);
    }, this.errorFunc);
  }

  onSelectProjection(projection: any, salle: any) {
    this.ticketCart = [];
    this.selectedProjection = projection;
    this.selectdSalle = salle;

    this.getTickets();
  }

  showTickets(salle: any) {
    return this.selectdSalle && this.selectdSalle.id === salle.id && this.selectedProjection != null;
  }

  addOrRemoveTicketCart(ticket: any) {
    ticket.selected = !ticket.selected;
    if (ticket.selected) {
      this.ticketCart.push(ticket.id);
    } else {
      this.ticketCart.splice(this.ticketCart.indexOf(ticket.id), 1);
    }
  }

  isSelectedItem(projection: any) {
    return this.selectedProjection && this.selectedProjection.id === projection.id;
  }

  getTickets() {
    this.selectedProjection.tickets = [];
    this.isLoadingTickets = true;
    this.cinemaService.fetchTickets(this.selectedProjection._links.tickets.href).subscribe(result => {
      this.isLoadingTickets = false;
      // @ts-ignore
      this.selectedProjection.tickets = result._embedded.tickets;
    }, this.errorFunc);
  }

  orderTickets() {
    this.cinemaService.orderTickets({
      nomClient: this.fullName,
      codePayment: this.paymentNumber,
      tickets: this.ticketCart
    })
      .subscribe((result: any[]) => {
          this.message.success('Ordered successfully !');
          this.getTickets();
        }, this.errorFunc
      );
  }

  getCities() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.cinemaService.getCities().subscribe(result => {
        this.citiesOptions = [];
        // @ts-ignore
        result._embedded.villes.forEach(v => {
          this.citiesOptions.push({id: v.id, city: v.name, cinemas: v._links.cinemas});
        });
      }, this.errorFunc, () =>
        this.isLoading = false);
    }
  }

  getCinemas() {
    if (this.selectedCity?.cinemas?.href) {
      this.isLoading = true;
      this.cinemaService.getCinemas(this.selectedCity.cinemas.href).subscribe(result => {
        this.isLoading = false;
        // @ts-ignore
        this.cinemas = result._embedded.cinemas;
      }, this.errorFunc);
    } else {
      this.message.error('No selected city');
    }

  }

  showAddCityModal(): void {
    this.isAddCityModalVisible = true;
  }

  handleAddCityModalOk(): void {
    this.isAddCityModalVisible = false;
    this.getCities();
  }

  handleAddCityModalCancel(): void {
    this.isAddCityModalVisible = false;
    this.getCities();
  }

  editCity() {

  }

  deleteCity() {
    if (this.selectedCity) {
      this.cinemaService.deleteCity(this.selectedCity.id).subscribe(res => {
        this.selectedCinema = null;
        this.resetData();
        this.getCities();
      }, error => this.errorFunc(error));
    }
  }
}
