import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISentMessage, SentMessage } from '../sent-message.model';
import { SentMessageService } from '../service/sent-message.service';

@Injectable({ providedIn: 'root' })
export class SentMessageRoutingResolveService implements Resolve<ISentMessage> {
  constructor(protected service: SentMessageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISentMessage> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sentMessage: HttpResponse<SentMessage>) => {
          if (sentMessage.body) {
            return of(sentMessage.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SentMessage());
  }
}
