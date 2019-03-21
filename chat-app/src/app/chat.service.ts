import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MessageChat } from './message-chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private user: string;
  private group: string[] = [];
  private isJoined: boolean;
  public messageChats: MessageChat[] = [];
  public isJoinObservable = this.socket.fromEvent<boolean>('is join');

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
    this.socket.fromEvent<MessageChat>('chat message').subscribe(msg => {
      console.log('socket: chat message', msg);
      this.messageChats = this.messageChats.concat(msg);
    });
    this.socket.fromEvent<MessageChat>('get unread chat').subscribe(msg => {
      console.log('socket: get unread chat', msg);
      this.messageChats = this.messageChats.concat(msg);
    });
  }

  clearMessageChats(): void {
    this.messageChats = [];
  }

  setUser(user: string): void {
    this.user = user;
  }

  getUser(): string {
    return this.user;
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
