import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { defer } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


/**
 * Create async observable that emits-once and completes
 * after a JS engine turn
 */
function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

/**
 * Create async observable error that errors
 * after a JS engine turn
 */
function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

// ========================================================== //
// describe('UserService (with spies)', () => {
//   let httpClientSpy: { get: jasmine.Spy };
//   let userService: UserService; 

//   beforeEach(() => {
//     httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
//     userService = new UserService(httpClientSpy as any);
//   });

//   it('should return expected users', (done: DoneFn) => {
//     const expected: any[] = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
//     httpClientSpy.get.and.returnValue(asyncData(expected));

//     userService.getUsers().subscribe(
//       users => {
//         expect(users).toEqual(expected, 'expected users');
//         done();
//       },
//       done.fail
//     );
//     expect(httpClientSpy.get.calls.count()).toEqual(1, 'one call');
//   });

//   it('should return an error when the server returns a 404', (done: DoneFn) => {
//     const errorResponse = new HttpErrorResponse({
//       error: 'test 404 error',
//       status: 404,
//       statusText: 'Not Found'
//     });

//     httpClientSpy.get.and.returnValue(asyncError(errorResponse));

//     userService.getUsers().subscribe(
//       users => done.fail('expected an error, not users'),
//       error => {
//         expect(error.message).toContain('test 404 error');
//         done();
//       }
//     );
//   });
// });

describe('UserService (with mocks)', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [ HttpClientTestingModule ],
      // Provide the service-under-test
      providers: [ UserService ],
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  })

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('#getUsers', () => {
    let expectedUsers: any[];
    beforeEach(() => {
      userService = TestBed.inject(UserService);
      expectedUsers = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ]
    })

    it('should return expected users', () => {
      userService.getUsers().subscribe(
        users => expect(users).toEqual(expectedUsers, 'should return expected users'),
        fail
      );

      const req = httpTestingController.expectOne(userService.url);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock users
      req.flush(expectedUsers);
    });

    it('should be OK returning no users', () => {
      userService.getUsers().subscribe(
        users => expect(users.length).toEqual(0, 'should have empty users array'),
        fail
      );
  
      const req = httpTestingController.expectOne(userService.url);
      req.flush([]); // Respond with no heroes
    });
  
    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';
      userService.getUsers().subscribe(
        users => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );
  
      const req = httpTestingController.expectOne(userService.url);
  
      // respond with a 404 and the error message in the body
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });
  
    it('should return expected users (called multiple times)', () => {
      userService.getUsers().subscribe();
      userService.getUsers().subscribe();
      userService.getUsers().subscribe(
        users => expect(users).toEqual(expectedUsers, 'should return expected users'),
        fail
      );
  
      const requests = httpTestingController.match(userService.url);
      expect(requests.length).toEqual(3, 'calls to getUsers()');
  
      // Respond to each request with different mock hero results
      requests[0].flush([]);
      requests[1].flush([{id: 1, name: 'bob'}]);
      requests[2].flush(expectedUsers);
    });
  })

  describe('#updateHero', () => {
    // Expecting the query form of URL so should not 404 when id not found
    // const makeUrl = (id: number) => `${userService.url}/?id=${id}`;

    it('should update a user and return it', () => {

      const updateUser: any = { id: 1, name: 'A' };

      userService.updateUser(updateUser).subscribe(
        data => expect(data).toEqual(updateUser, 'should return the user'),
        fail
      );

      // HeroService should have made one request to PUT hero
      const req = httpTestingController.expectOne(userService.url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateUser);

      // Expect server to return after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateUser });
      req.event(expectedResponse);
    });

    it('should turn 404 error into user-facing error', () => {
      const msg = 'Deliberate 404';
      const updateUser: any = { id: 1, name: 'A' };
      userService.updateUser(updateUser).subscribe(
        users => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(userService.url);

      // respond with a 404 and the error message in the body
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';

      const updateUser: any = { id: 1, name: 'A' };
      userService.updateUser(updateUser).subscribe(
        users => fail('expected to fail'),
        error => expect(error.message).toContain(emsg)
      );

      const req = httpTestingController.expectOne(userService.url);

      // Create mock ErrorEvent, raised when something goes wrong at the network level.
      // Connection timeout, DNS error, offline, etc
      const errorEvent = new ErrorEvent('so sad', {
        message: emsg,
        // The rest of this is optional and not used.
        // Just showing that you could provide this too.
        filename: 'UserService.ts',
        lineno: 42,
        colno: 21
      });

      // Respond with mock error
      req.error(errorEvent);
    });
  });

  // describe('#addUser', () => {
  //   it('should addUser a user', () => {

  //     const addUser = { id: 44, name: 'D' };

  //     userService.addUser(addUser).subscribe(
  //       () => console.log('User added!'),
  //       fail
  //     );

  //     const req = httpTestingController.expectOne(userService.url);
  //     expect(req.request.method).toEqual('POST');
  //     expect(req.request.body).toEqual(addUser);

  //     // Expect server to return the hero after PUT
  //     const expectedResponse = new HttpResponse(
  //       { status: 200, statusText: 'OK', body: addUser });
  //     req.event(expectedResponse);
  //   });
  // });

});
