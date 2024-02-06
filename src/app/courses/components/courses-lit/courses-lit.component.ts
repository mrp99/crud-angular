import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../shared/interface/course';


@Component({
  selector: 'app-courses-lit',
  templateUrl: './courses-lit.component.html',
  styleUrls: ['./courses-lit.component.scss']
})
export class CoursesLitComponent implements OnInit {

  @Input() courses: Course[] = [];
  @Output() addEvent = new EventEmitter<void>();

  displayedColumns: string[] = ['name', 'category', 'actions'];

  constructor(

  ) { }

  ngOnInit(): void {
  }

  public onAdd(): void {
    this.addEvent.emit();
  }

}
