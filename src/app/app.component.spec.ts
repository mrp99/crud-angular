import { TestBed } from "@angular/core/testing";
import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatToolbarModule, RouterModule.forRoot(
        [{ path: '', component: AppComponent }]
      ),
        AppComponent],
    }).compileComponents();
  });

  it('Should create the AppComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('Should have as title == CRUD Angular + Spring', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('CRUD Angular + Spring');
  });

  it('should display title value in span element', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const spanElement = compiled.querySelector('mat-toolbar span');
    const text = spanElement?.innerHTML;
    expect(text).toBe(app.title);
  });

});
