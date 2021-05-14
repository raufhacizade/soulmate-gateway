import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILikeHistory, LikeHistory } from '../like-history.model';
import { LikeHistoryService } from '../service/like-history.service';

@Injectable({ providedIn: 'root' })
export class LikeHistoryRoutingResolveService implements Resolve<ILikeHistory> {
  constructor(protected service: LikeHistoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILikeHistory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((likeHistory: HttpResponse<LikeHistory>) => {
          if (likeHistory.body) {
            return of(likeHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LikeHistory());
  }
}
