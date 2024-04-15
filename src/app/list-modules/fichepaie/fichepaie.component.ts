import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-fichepaie',
  templateUrl: './fichepaie.component.html',
  styleUrls: ['./fichepaie.component.scss'],
})
export class fichepaieComponent {
  constructor(private ngZone: NgZone) {}
}
