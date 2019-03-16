import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ChatComponent } from './chat/chat.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { CreateGroupComponent } from './create-group/create-group.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ChatComponent,
    SignInComponent,
    HomeComponent,
    CreateGroupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ScrollDispatchModule

  ],
  entryComponents: [
    CreateGroupComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
