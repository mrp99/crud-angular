import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesListComponent } from "./courses-list.component";
import { MatPaginator } from "@angular/material/paginator";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatPaginatorMock } from "../../shared/mocks/mockMatPaginator";
import { mockCourses } from "../../shared/mocks/mockCourses";

describe('CoursesListComponent', () => {
  let component: CoursesListComponent;
  let fixture: ComponentFixture<CoursesListComponent>;
  let paginator: MatPaginator;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CoursesListComponent,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MatPaginator,
          useValue: MatPaginatorMock
        }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesListComponent);
    component = fixture.componentInstance;

    paginator = TestBed.createComponent(MatPaginator).componentInstance as MatPaginator;
    component.paginator = paginator;
    fixture.detectChanges();
  });

  it('should create CoursesListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should check if displayedColumns have value', () => {
    expect(component.displayedColumns).toBeTruthy();
    expect(component.displayedColumns.length).toBe(3);
  });

  it('Proprities should be defined as Paginator', () => {
    const size = (component.paginator.pageSize = 10);
    const len = (component.paginator.length = 100);
    const index = (component.paginator.pageIndex = 0);
    const pageSizeOptions = (component.paginator.pageSizeOptions = [5, 10, 20]);
    const pag = (component.paginator = MatPaginatorMock);
    expect(size).toBe(10);
    expect(len).toBe(100);
    expect(index).toBe(0);
    expect(pageSizeOptions).toEqual([5, 10, 20]);
    expect(pag).toBe(MatPaginatorMock);
  });

  it('should set paginator to dataSource ngOnInit', () => {
    component.paginator.pageSize = 5;
    component.paginator.pageSizeOptions = [5, 10];
    component.paginator = paginator;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.dataSource.paginator).toEqual(paginator);
  });

  it('should set paginator to dataSource after view init', () => {
    component.paginator.pageSize = 5;
    component.paginator.pageSizeOptions = [5, 10];
    component.paginator = paginator;
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toEqual(paginator);
  });


  it('should emit addEvent when onAdd is called', () => {
    spyOn(component.addEvent, 'emit');
    component.onAdd();
    expect(component.addEvent.emit).toHaveBeenCalled();
  });

  it('should emit editEvent with the correct course when onEdit is called', () => {
    spyOn(component.editEvent, 'emit');
    component.onEdit(mockCourses);
    expect(component.editEvent.emit).toHaveBeenCalledWith(mockCourses);
  });

  it('should emit remove with the correct course when onRemove is called', () => {
    spyOn(component.remove, 'emit');
    component.onRemove(mockCourses);
    expect(component.remove.emit).toHaveBeenCalledWith(mockCourses);
  });

});
