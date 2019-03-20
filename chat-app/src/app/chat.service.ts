import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private user: string;
  private group: string[] = [];

  constructor(
     private socket: Socket,
  ) {
    this.socket.on('group list', msg => {
      console.log('msg', msg);
      this.group.push(...msg);
    });
    this.socket.on('new group', msg => {
      console.log('msg', msg);
      this.group.push(msg);
    });
  }

  setUser(user: string): void {
    this.user = user;
  }

  getUser(): string {
    return this.user;
  }

  getGroupList(): string[] {
    return this.group;
  }

  clearGroupList(): void {
    this.group = [];
    console.log('sign out', this.group);
  }
}
