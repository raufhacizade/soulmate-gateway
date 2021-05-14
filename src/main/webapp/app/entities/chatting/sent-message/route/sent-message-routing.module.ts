import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SentMessageComponent } from '../list/sent-message.component';
import { SentMessageDetailComponent } from '../detail/sent-message-detail.component';
import { SentMessageUpdateComponent } from '../update/sent-message-update.component';
import { SentMessageRoutingResolveService } from './sent-message-routing-resolve.service';

const sentMessageRoute: Routes = [
  {
    path: '',
    component: SentMessageComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SentMessageDetailComponent,
    resolve: {
      sentMessage: SentMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SentMessageUpdateComponent,
    resolve: {
      sentMessage: SentMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SentMessageUpdateComponent,
    resolve: {
      sentMessage: SentMessageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sentMessageRoute)],
  exports: [RouterModule],
})
export class SentMessageRoutingModule {}
