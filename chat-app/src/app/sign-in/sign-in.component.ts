import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  username: string;

  constructor(
    private router: Router,
    private socket: Socket,
    private chat: ChatService,
  ) { }

  ngOnInit() {
  }

  signIn(): void {
    this.chat.setUser(this.username);
    this.socket.emit('login', this.username);
    console.log('hello');
    this.router.navigate(['/']);
  }

}
