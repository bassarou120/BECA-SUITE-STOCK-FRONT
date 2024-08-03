import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  @Input() message: string = '';
  @Input() show: boolean = false;
  @Input() onClose: () => void = () => {};

  constructor() { }

  ngOnInit(): void { }

  closeAlert() {
    this.show = false;
    this.onClose();
  }
}
