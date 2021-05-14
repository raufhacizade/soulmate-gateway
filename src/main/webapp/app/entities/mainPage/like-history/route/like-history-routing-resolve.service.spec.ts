jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILikeHistory, LikeHistory } from '../like-history.model';
import { LikeHistoryService } from '../service/like-history.service';

import { LikeHistoryRoutingResolveService } from './like-history-routing-resolve.service';

describe('Service Tests', () => {
  describe('LikeHistory routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LikeHistoryRoutingResolveService;
    let service: LikeHistoryService;
    let resultLikeHistory: ILikeHistory | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LikeHistoryRoutingResolveService);
      service = TestBed.inject(LikeHistoryService);
      resultLikeHistory = undefined;
    });

    describe('resolve', () => {
      it('should return ILikeHistory returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLikeHistory = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLikeHistory).toEqual({ id: 123 });
      });

      it('should return new ILikeHistory if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLikeHistory = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLikeHistory).toEqual(new LikeHistory());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLikeHistory = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLikeHistory).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
