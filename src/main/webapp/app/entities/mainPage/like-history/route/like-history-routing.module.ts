import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LikeHistoryComponent } from '../list/like-history.component';
import { LikeHistoryDetailComponent } from '../detail/like-history-detail.component';
import { LikeHistoryUpdateComponent } from '../update/like-history-update.component';
import { LikeHistoryRoutingResolveService } from './like-history-routing-resolve.service';

const likeHistoryRoute: Routes = [
  {
    path: '',
    component: LikeHistoryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LikeHistoryDetailComponent,
    resolve: {
      likeHistory: LikeHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LikeHistoryUpdateComponent,
    resolve: {
      likeHistory: LikeHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LikeHistoryUpdateComponent,
    resolve: {
      likeHistory: LikeHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(likeHistoryRoute)],
  exports: [RouterModule],
})
export class LikeHistoryRoutingModule {}
