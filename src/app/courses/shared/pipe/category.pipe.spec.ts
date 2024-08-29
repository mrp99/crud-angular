import { CategoryPipe } from "./category.pipe";

describe('CategoryPipe', () => {
  let pipe: CategoryPipe;
  beforeEach((() => {
    pipe = new CategoryPipe();
  }));

  it('should create an instance of pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "Front-End" to "code"', () => {
    expect(pipe.transform('Front-End')).toBe('code');
  });

  it('should transform "Back-End" to "computer"', () => {
    expect(pipe.transform('Back-End')).toBe('computer');
  });

  it('should return "code" for any other value', () => {
    expect(pipe.transform('Full-Stack')).toBe('code');
    expect(pipe.transform('DevOps')).toBe('code');
    expect(pipe.transform('')).toBe('code');
  });

});
