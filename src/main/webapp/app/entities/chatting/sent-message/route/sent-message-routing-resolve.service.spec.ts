jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISentMessage, SentMessage } from '../sent-message.model';
import { SentMessageService } from '../service/sent-message.service';

import { SentMessageRoutingResolveService } from './sent-message-routing-resolve.service';

describe('Service Tests', () => {
  describe('SentMessage routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SentMessageRoutingResolveService;
    let service: SentMessageService;
    let resultSentMessage: ISentMessage | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SentMessageRoutingResolveService);
      service = TestBed.inject(SentMessageService);
      resultSentMessage = undefined;
    });

    describe('resolve', () => {
      it('should return ISentMessage returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSentMessage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSentMessage).toEqual({ id: 123 });
      });

      it('should return new ISentMessage if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSentMessage = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSentMessage).toEqual(new SentMessage());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSentMessage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSentMessage).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
