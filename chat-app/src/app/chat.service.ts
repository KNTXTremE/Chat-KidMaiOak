import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private user: string;
  private group: string[] = [];
  private isJoined: boolean;
  private message: string;

  constructor(
     private socket: Socket,
  ) {
    this.socket.on('group list', msg => {
      console.log('socket: group list', msg);
      this.group.push(...msg);
    });
    this.socket.on('new group', msg => {
      console.log('socket: new group', msg);
      this.group.push(msg);
    });
    this.socket.on('is join', msg => {
      console.log('socket: is join', msg);
      this.isJoined = msg;
    });
    this.socket.on('chat message', msg => {
      console.log('socket: chat message', msg);
      this.message = msg;
    });
    this.socket.on('get unread chat', msg => {
      console.log('socket: get unread chat', msg);
      this.message = msg;
    });
  }
  setUser(user: string): void {
    this.user = user;
  }

  getUser(): string {
    return this.user;
  }

  get messageVal(): string {
    return this.message;
  }

  get isJoinedVal(): boolean {
    return this.isJoined;
  }

  getGroupList(): string[] {
    return this.group;
  }

  clearGroupList(): void {
    this.group = [];
    console.log('sign out', this.group);
  }
}
