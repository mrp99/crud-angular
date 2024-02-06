import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { CoursesRoutingModule } from '../courses-routing/courses-routing.module';
import { SharedModule } from '../shared/shared-module/shared.module';
import { CoursesComponent } from '../components/courses/courses.component';
import { CourseFormComponent } from '../components/course-form/course-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoursesLitComponent } from '../components/courses-lit/courses-lit.component';



@NgModule({
  declarations: [
    CoursesComponent,
    CourseFormComponent,
    CoursesLitComponent
  ],
  imports: [
    AppMaterialModule,
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class CoursesModule { }
