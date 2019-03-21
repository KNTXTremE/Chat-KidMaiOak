import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatService } from '../chat.service';
import { MessageChat } from '../message-chat';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() groupName: string;
  message: string;


  constructor(
    private socket: Socket,
    public chat: ChatService,
  ) { }

  ngOnInit() {
  }

  get isJoined(): boolean {
    return this.chat.isJoinedVal;
  }

  get messageChat(): MessageChat[] {
    return this.chat.messageChats;
  }

  joinGroup() {
    this.socket.emit('join group', this.groupName);
  }

  leaveGroup() {
    this.socket.emit('leave group', this.groupName);
  }

  sentMessage() {
    const messageSent = { text: this.message, group: this.groupName };
    this.socket.emit('chat message', messageSent);
    this.message = '';
  }
}
