import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatService } from '../chat.service';

export interface MessageChat {
  message: string;
  user: string;
  time: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() groupName: string;
  message: string;
  messageChat: MessageChat[];


  constructor(
    private socket: Socket,
    private chat: ChatService,
  ) { }

  ngOnInit() {
    // this.messageChat = [ { 'message': 'hello world !! chat now !', 'user': 'ktpunnisa', 'time': '2.24pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'tamtam', 'time': '2.25pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'ktpunnisa', 'time': '2.26pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'ongeiei', 'time': '2.29pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'tamtam', 'time': '2.25pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'ktpunnisa', 'time': '2.26pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'ongeiei', 'time': '2.29pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'tamtam', 'time': '2.25pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'ktpunnisa', 'time': '2.26pm'},
    // { 'message': 'hello world !! chat now !', 'user': 'ongeiei', 'time': '2.29pm'}];
  }

  get isJoined(): boolean {
    return this.chat.isJoinedVal;
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
