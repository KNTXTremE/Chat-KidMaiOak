import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateGroupComponent } from '../create-group/create-group.component';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  joinedGroup: string[] = ['CP43', 'KidMaiOak', 'Parallel'];
  allGroup: string[] = ['CP43', 'KidMaiOak', 'Parallel', 'ABCD', 'Sky Cafe'];
  @Output() groupName = new EventEmitter<string>();
  name: string;


  constructor(private dialog: MatDialog) {
   }


  ngOnInit() {
  }

  letChat(group: string): void {
    this.groupName.emit(group);
  }

  openReportDialog(): void {
    this.dialog.open(CreateGroupComponent, {
      width: '450px',
      height: '600px',
      data: {
        name: this.name
      }
    });
  }
}
