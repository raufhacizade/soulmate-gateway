import * as dayjs from 'dayjs';
import { IPerson } from 'app/entities/registration/person/person.model';

export interface ILikeHistory {
  id?: number;
  whoLikeId?: number;
  likedPersonId?: number;
  sendDate?: dayjs.Dayjs | null;
  whoLiked?: IPerson | null;
  likedPerson?: IPerson | null;
}

export class LikeHistory implements ILikeHistory {
  constructor(
    public id?: number,
    public whoLikeId?: number,
    public likedPersonId?: number,
    public sendDate?: dayjs.Dayjs | null,
    public whoLiked?: IPerson | null,
    public likedPerson?: IPerson | null
  ) {}
}

export function getLikeHistoryIdentifier(likeHistory: ILikeHistory): number | undefined {
  return likeHistory.id;
}
