import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';


interface Data {
  key: string;
  url: string;
  detail: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'elearning-app';
  data: Data = environment.data;
}
