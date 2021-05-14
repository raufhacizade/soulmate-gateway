import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ILikeHistory, LikeHistory } from '../like-history.model';

import { LikeHistoryService } from './like-history.service';

describe('Service Tests', () => {
  describe('LikeHistory Service', () => {
    let service: LikeHistoryService;
    let httpMock: HttpTestingController;
    let elemDefault: ILikeHistory;
    let expectedResult: ILikeHistory | ILikeHistory[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LikeHistoryService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        whoLikeId: 0,
        likedPersonId: 0,
        sendDate: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            sendDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a LikeHistory', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            sendDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            sendDate: currentDate,
          },
          returnedFromService
        );

        service.create(new LikeHistory()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a LikeHistory', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            whoLikeId: 1,
            likedPersonId: 1,
            sendDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            sendDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a LikeHistory', () => {
        const patchObject = Object.assign({}, new LikeHistory());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            sendDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of LikeHistory', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            whoLikeId: 1,
            likedPersonId: 1,
            sendDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            sendDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a LikeHistory', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLikeHistoryToCollectionIfMissing', () => {
        it('should add a LikeHistory to an empty array', () => {
          const likeHistory: ILikeHistory = { id: 123 };
          expectedResult = service.addLikeHistoryToCollectionIfMissing([], likeHistory);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(likeHistory);
        });

        it('should not add a LikeHistory to an array that contains it', () => {
          const likeHistory: ILikeHistory = { id: 123 };
          const likeHistoryCollection: ILikeHistory[] = [
            {
              ...likeHistory,
            },
            { id: 456 },
          ];
          expectedResult = service.addLikeHistoryToCollectionIfMissing(likeHistoryCollection, likeHistory);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a LikeHistory to an array that doesn't contain it", () => {
          const likeHistory: ILikeHistory = { id: 123 };
          const likeHistoryCollection: ILikeHistory[] = [{ id: 456 }];
          expectedResult = service.addLikeHistoryToCollectionIfMissing(likeHistoryCollection, likeHistory);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(likeHistory);
        });

        it('should add only unique LikeHistory to an array', () => {
          const likeHistoryArray: ILikeHistory[] = [{ id: 123 }, { id: 456 }, { id: 75494 }];
          const likeHistoryCollection: ILikeHistory[] = [{ id: 123 }];
          expectedResult = service.addLikeHistoryToCollectionIfMissing(likeHistoryCollection, ...likeHistoryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const likeHistory: ILikeHistory = { id: 123 };
          const likeHistory2: ILikeHistory = { id: 456 };
          expectedResult = service.addLikeHistoryToCollectionIfMissing([], likeHistory, likeHistory2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(likeHistory);
          expect(expectedResult).toContain(likeHistory2);
        });

        it('should accept null and undefined values', () => {
          const likeHistory: ILikeHistory = { id: 123 };
          expectedResult = service.addLikeHistoryToCollectionIfMissing([], null, likeHistory, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(likeHistory);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
