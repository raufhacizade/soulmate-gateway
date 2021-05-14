jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IReceivedMessage, ReceivedMessage } from '../received-message.model';
import { ReceivedMessageService } from '../service/received-message.service';

import { ReceivedMessageRoutingResolveService } from './received-message-routing-resolve.service';

describe('Service Tests', () => {
  describe('ReceivedMessage routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ReceivedMessageRoutingResolveService;
    let service: ReceivedMessageService;
    let resultReceivedMessage: IReceivedMessage | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ReceivedMessageRoutingResolveService);
      service = TestBed.inject(ReceivedMessageService);
      resultReceivedMessage = undefined;
    });

    describe('resolve', () => {
      it('should return IReceivedMessage returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReceivedMessage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReceivedMessage).toEqual({ id: 123 });
      });

      it('should return new IReceivedMessage if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReceivedMessage = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultReceivedMessage).toEqual(new ReceivedMessage());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReceivedMessage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReceivedMessage).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
