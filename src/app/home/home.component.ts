import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from '../items';
import { ItemsService } from '../items.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  items: Item[] = [];
  subscription!: Subscription;
  url: string = environment.data.url;

  // items$!: Observable<Item[]>;
  constructor(public svc: ItemsService) { }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.subscription = this.svc.getItems().subscribe(data => {
      this.items = data;
    });
    // this.items$ = this.svc.getItems();
  }

  // setEnumerations() {
  //   enum Compass {
  //     North, // = 2,
  //     East,
  //     South,
  //     West,
  //   }

  //   console.log(Compass);

  //   let direction: Compass = Compass.South;
  //   console.log('My direction:', direction);
	
  //   // We can even get the string value
  //   const directionName: string = Compass[Compass.South]
  //   console.log('My direction name:', directionName);
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
