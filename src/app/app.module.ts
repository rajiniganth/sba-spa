import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { ProjectComponent } from './project/project.component';
import { UserComponent } from './user/user.component';
import { TaskComponent } from './task/task.component';
import { ViewTaskComponent } from './task/view-task.component';
import { UserFilterPipe } from './pipe/user-filter.pipe';
import { SortPipe } from './pipe/sort.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Ng5SliderModule } from 'ng5-slider';
import { ProjectFilterPipe } from './pipe/project-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ProjectComponent,
    UserComponent,
    TaskComponent,
    ViewTaskComponent,
    UserFilterPipe,
    SortPipe,
    ProjectFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    Ng5SliderModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
