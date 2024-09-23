export interface IVoteDataItem {
    id: string;
    text: string;
    thumbnail: string;
    startAt: string;
    expiredAt: string;
    options: [];
}

export interface VotesResponse {
    data: IVoteDataItem[];
    meta: PaginationMeta;
}