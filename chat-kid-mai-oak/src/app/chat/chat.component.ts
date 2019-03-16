import { Component, OnInit, Input } from '@angular/core';

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
  isJoined: boolean;
  message: string;
  messageChat: MessageChat[];


  constructor() { }

  ngOnInit() {
    if (this.groupName == null) {
      this.isJoined = false;
    }
    this.messageChat = [ { 'message': 'hello world !! chat now !', 'user': 'ktpunnisa', 'time': '2.24pm'},
    { 'message': 'hello world !! chat now !', 'user': 'tamtam', 'time': '2.25pm'},
    { 'message': 'hello world !! chat now !', 'user': 'ktpunnisa', 'time': '2.26pm'},
    { 'message': 'hello world !! chat now !', 'user': 'ongeiei', 'time': '2.29pm'},
    { 'message': 'hello world !! chat now !', 'user': 'tamtam', 'time': '2.25pm'},
    { 'message': 'hello world !! chat now !', 'user': 'ktpunnisa', 'time': '2.26pm'},
    { 'message': 'hello world !! chat now !', 'user': 'ongeiei', 'time': '2.29pm'},
    { 'message': 'hello world !! chat now !', 'user': 'tamtam', 'time': '2.25pm'},
    { 'message': 'hello world !! chat now !', 'user': 'ktpunnisa', 'time': '2.26pm'},
    { 'message': 'hello world !! chat now !', 'user': 'ongeiei', 'time': '2.29pm'}];
  }

  joinGroup() {
    this.isJoined = true;
  }

  leaveGroup() {
    this.isJoined = false;
  }

  sentMessage() {
    this.message = '';
  }
}
