import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iConnect';
  width!:any;

  constructor() {

  }

  ngOnInit(): void {
  }

  toggle(){
    this.width = (this.width && this.width.width == '64px')? {'width':'250px'}: {'width':'64px'};
  }

  close(){
    this.width = {'width':'0px'};
  }
}
