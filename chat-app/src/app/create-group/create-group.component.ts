import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatService } from '../chat.service';
import { Socket } from 'ngx-socket-io';

interface DialogData {
  name: string;
}

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private chat: ChatService,
    private socket: Socket) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.socket.emit('create group', this.data.name);
    this.dialogRef.close();
  }

}
