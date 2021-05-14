import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReceivedMessageComponent } from '../list/received-message.component';
import { ReceivedMessageDetailComponent } from '../detail/received-message-detail.component';
import { ReceivedMessageUpdateComponent } from '../update/received-message-update.component';
import { ReceivedMessageRoutingResolveService } from './received-message-routing-resolve.service';

const receivedMessageRoute: Routes = [
  {
    path: '',
    component: ReceivedMessageComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReceivedMessageDetailComponent,
    resolve: {
      receivedMessage: ReceivedMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReceivedMessageUpdateComponent,
    resolve: {
      receivedMessage: ReceivedMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReceivedMessageUpdateComponent,
    resolve: {
      receivedMessage: ReceivedMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(receivedMessageRoute)],
  exports: [RouterModule],
})
export class ReceivedMessageRoutingModule {}
