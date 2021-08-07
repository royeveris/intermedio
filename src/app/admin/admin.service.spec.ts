import { TestBed, waitForAsync } from '@angular/core/testing';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [AdminService]})
    service = TestBed.inject(AdminService);
  })

  it('should use value', () => {
    let newValue = service.getValue();
    expect(newValue).toBe('real value');
  })

  it('should set value AdminService.setValue()', () => {
    service.setValue('new value');
    // expect(service.value).toBe('new value');
    expect(service.getValue()).toBe('new value');
  });

  it('should wait for AdminService getObservableValue', waitForAsync(() => {
    service.getObservableValue().subscribe(
      value => expect(value).toBe('observable value')
    );
  }));

  it('should wait for AdminService.getPromiseVale()', waitForAsync(() => {
    service.getPromiseValue().then(
      value => expect(value).toBe('promise value')
    )
  }));

  it('should wait for AdminService.getObservableDelayValue()', waitForAsync(()=> {
    service.getObservableDelayValue().subscribe(value => {
      expect(value).toBe('observable delay value')
    });
  }));

})