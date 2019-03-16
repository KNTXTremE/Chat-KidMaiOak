import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  groupName: string;

  constructor() {
  }

  ngOnInit() {
    this.username = 'Khaotang';
  }

  letChat(event: string) {
    this.groupName = event;
  }
}
