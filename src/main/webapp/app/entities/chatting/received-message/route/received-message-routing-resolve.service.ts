import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReceivedMessage, ReceivedMessage } from '../received-message.model';
import { ReceivedMessageService } from '../service/received-message.service';

@Injectable({ providedIn: 'root' })
export class ReceivedMessageRoutingResolveService implements Resolve<IReceivedMessage> {
  constructor(protected service: ReceivedMessageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReceivedMessage> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((receivedMessage: HttpResponse<ReceivedMessage>) => {
          if (receivedMessage.body) {
            return of(receivedMessage.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ReceivedMessage());
  }
}
