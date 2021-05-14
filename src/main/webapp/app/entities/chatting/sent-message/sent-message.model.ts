import * as dayjs from 'dayjs';

export interface ISentMessage {
  id?: number;
  senderId?: number;
  toPersonId?: number;
  message?: string | null;
  sendDate?: dayjs.Dayjs | null;
  isDeleted?: boolean | null;
}

export class SentMessage implements ISentMessage {
  constructor(
    public id?: number,
    public senderId?: number,
    public toPersonId?: number,
    public message?: string | null,
    public sendDate?: dayjs.Dayjs | null,
    public isDeleted?: boolean | null
  ) {
    this.isDeleted = this.isDeleted ?? false;
  }
}

export function getSentMessageIdentifier(sentMessage: ISentMessage): number | undefined {
  return sentMessage.id;
}
