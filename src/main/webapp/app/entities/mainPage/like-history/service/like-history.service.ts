import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILikeHistory, getLikeHistoryIdentifier } from '../like-history.model';

export type EntityResponseType = HttpResponse<ILikeHistory>;
export type EntityArrayResponseType = HttpResponse<ILikeHistory[]>;

@Injectable({ providedIn: 'root' })
export class LikeHistoryService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/like-histories', 'mainpage');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(likeHistory: ILikeHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(likeHistory);
    return this.http
      .post<ILikeHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(likeHistory: ILikeHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(likeHistory);
    return this.http
      .put<ILikeHistory>(`${this.resourceUrl}/${getLikeHistoryIdentifier(likeHistory) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(likeHistory: ILikeHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(likeHistory);
    return this.http
      .patch<ILikeHistory>(`${this.resourceUrl}/${getLikeHistoryIdentifier(likeHistory) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILikeHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILikeHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLikeHistoryToCollectionIfMissing(
    likeHistoryCollection: ILikeHistory[],
    ...likeHistoriesToCheck: (ILikeHistory | null | undefined)[]
  ): ILikeHistory[] {
    const likeHistories: ILikeHistory[] = likeHistoriesToCheck.filter(isPresent);
    if (likeHistories.length > 0) {
      const likeHistoryCollectionIdentifiers = likeHistoryCollection.map(likeHistoryItem => getLikeHistoryIdentifier(likeHistoryItem)!);
      const likeHistoriesToAdd = likeHistories.filter(likeHistoryItem => {
        const likeHistoryIdentifier = getLikeHistoryIdentifier(likeHistoryItem);
        if (likeHistoryIdentifier == null || likeHistoryCollectionIdentifiers.includes(likeHistoryIdentifier)) {
          return false;
        }
        likeHistoryCollectionIdentifiers.push(likeHistoryIdentifier);
        return true;
      });
      return [...likeHistoriesToAdd, ...likeHistoryCollection];
    }
    return likeHistoryCollection;
  }

  protected convertDateFromClient(likeHistory: ILikeHistory): ILikeHistory {
    return Object.assign({}, likeHistory, {
      sendDate: likeHistory.sendDate?.isValid() ? likeHistory.sendDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.sendDate = res.body.sendDate ? dayjs(res.body.sendDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((likeHistory: ILikeHistory) => {
        likeHistory.sendDate = likeHistory.sendDate ? dayjs(likeHistory.sendDate) : undefined;
      });
    }
    return res;
  }
}
