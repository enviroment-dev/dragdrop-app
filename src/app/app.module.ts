import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MDBBootstrapModule, ButtonsModule, WavesModule,
  InputsModule, CollapseModule, ModalModule } from 'angular-bootstrap-md';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { ToastrModule } from 'ngx-toastr';
import { LoadingComponent } from './loading/loading.component';
import { DialogComponent } from './dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    MenuLeftComponent,
    LoadingComponent,
    DialogComponent
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    DragDropModule,
    MDBBootstrapModule.forRoot(),
    ToastrModule.forRoot(),
    ButtonsModule, WavesModule, CollapseModule, InputsModule
  ],
  providers: [],
  entryComponents: [DialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
