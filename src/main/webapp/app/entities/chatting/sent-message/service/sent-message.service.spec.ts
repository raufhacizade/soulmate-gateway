import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISentMessage, SentMessage } from '../sent-message.model';

import { SentMessageService } from './sent-message.service';

describe('Service Tests', () => {
  describe('SentMessage Service', () => {
    let service: SentMessageService;
    let httpMock: HttpTestingController;
    let elemDefault: ISentMessage;
    let expectedResult: ISentMessage | ISentMessage[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SentMessageService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        senderId: 0,
        toPersonId: 0,
        message: 'AAAAAAA',
        sendDate: currentDate,
        isDeleted: false,
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

      it('should create a SentMessage', () => {
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

        service.create(new SentMessage()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SentMessage', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            senderId: 1,
            toPersonId: 1,
            message: 'BBBBBB',
            sendDate: currentDate.format(DATE_FORMAT),
            isDeleted: true,
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

      it('should partial update a SentMessage', () => {
        const patchObject = Object.assign(
          {
            senderId: 1,
            toPersonId: 1,
            message: 'BBBBBB',
            isDeleted: true,
          },
          new SentMessage()
        );

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

      it('should return a list of SentMessage', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            senderId: 1,
            toPersonId: 1,
            message: 'BBBBBB',
            sendDate: currentDate.format(DATE_FORMAT),
            isDeleted: true,
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

      it('should delete a SentMessage', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSentMessageToCollectionIfMissing', () => {
        it('should add a SentMessage to an empty array', () => {
          const sentMessage: ISentMessage = { id: 123 };
          expectedResult = service.addSentMessageToCollectionIfMissing([], sentMessage);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sentMessage);
        });

        it('should not add a SentMessage to an array that contains it', () => {
          const sentMessage: ISentMessage = { id: 123 };
          const sentMessageCollection: ISentMessage[] = [
            {
              ...sentMessage,
            },
            { id: 456 },
          ];
          expectedResult = service.addSentMessageToCollectionIfMissing(sentMessageCollection, sentMessage);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SentMessage to an array that doesn't contain it", () => {
          const sentMessage: ISentMessage = { id: 123 };
          const sentMessageCollection: ISentMessage[] = [{ id: 456 }];
          expectedResult = service.addSentMessageToCollectionIfMissing(sentMessageCollection, sentMessage);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sentMessage);
        });

        it('should add only unique SentMessage to an array', () => {
          const sentMessageArray: ISentMessage[] = [{ id: 123 }, { id: 456 }, { id: 22999 }];
          const sentMessageCollection: ISentMessage[] = [{ id: 123 }];
          expectedResult = service.addSentMessageToCollectionIfMissing(sentMessageCollection, ...sentMessageArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const sentMessage: ISentMessage = { id: 123 };
          const sentMessage2: ISentMessage = { id: 456 };
          expectedResult = service.addSentMessageToCollectionIfMissing([], sentMessage, sentMessage2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sentMessage);
          expect(expectedResult).toContain(sentMessage2);
        });

        it('should accept null and undefined values', () => {
          const sentMessage: ISentMessage = { id: 123 };
          expectedResult = service.addSentMessageToCollectionIfMissing([], null, sentMessage, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sentMessage);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
