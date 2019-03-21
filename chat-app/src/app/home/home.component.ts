import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  groupName: string;
  isJoined: boolean;

  constructor(
    private chat: ChatService,
    private router: Router,
  ) {
    this.username = this.chat.getUser();
    if (this.username == null) {
      this.router.navigate(['/sign-in']);
    }
  }

  ngOnInit() {
  }

  letChat(event: string) {
    this.groupName = event;
    console.log('group name', this.groupName);
  }

  isJoin(event: boolean) {
    this.isJoined = event;
    console.log('is joined', this.isJoined);
  }

  signOut(): void {
    this.chat.clearGroupList();
  }
}
