import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CoursesComponent } from './courses/components/courses/courses.component';
import { ErrorDialogComponent } from './courses/components/error-dialog/error-dialog.component';
import { CourseFormComponent } from './courses/components/course-form/course-form.component';


@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    ErrorDialogComponent,
    CourseFormComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
