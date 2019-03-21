import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { ChatService } from '../chat.service';
import { Socket } from 'ngx-socket-io';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  groupList: Array<String> = [];
  @Output() groupName = new EventEmitter<string>();
  name: string;
  selectedName: string;


  constructor(
    private dialog: MatDialog,
    private chat: ChatService,
    private socket: Socket,
  ) {
    this.setupObservable();
  }

  ngOnInit() {
    this.groupList = this.getGroupList();
    this.groupName.emit('');
    this.selectedName = '';
  }

  setupObservable(): void {
    this.chat.isJoinObservable.subscribe(msg => {
      if (this.chat.isJoinedVal) {
        this.socket.emit('unexit group', this.selectedName);
        console.log('unexit', this.selectedName);
      }
    });
  }

  getGroupList(): Array<String> {
    return this.chat.getGroupList();
  }

  letChat(group: string): void {
    if (this.selectedName !== '') {
      console.log('exit group', this.selectedName);
      this.chat.clearMessageChats();
      this.socket.emit('exit group', this.selectedName);
    }
    this.selectedName = group;
    this.socket.emit('is join group', group);
    this.groupName.emit(group);
  }

  openReportDialog(): void {
    this.dialog.open(CreateGroupComponent, {
      width: '400px',
      height: '220px',
      data: {
        name: this.name
      }
    });
  }
}
