import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
