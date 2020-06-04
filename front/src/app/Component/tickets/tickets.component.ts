import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit {
  tabs: Array<{ name: string }> = [];
  selectedIndex = 0;

  log(args: any[]): void {
    console.log(args);
  }

  ngOnInit(): void {
    ['Agadir', 'Casablaca', 'Agadir', 'Casablaca', 'Agadir', 'Casablaca', 'Agadir', 'Casablaca', 'Agadir', 'Casablaca', 'Agadir', 'Casablaca' ].forEach(city => {
      this.tabs.push({name: city});
    });
  }
}
