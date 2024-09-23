import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  GET_MARKET_VOTES
} from "@/constants/api-routes";
import { ResponseData } from "@/types/response";
import { IVoteDataItem } from "@/types/votes";

export const marketVotes = async (
  header: AxiosRequestConfig
): Promise<AxiosResponse<IVoteDataItem[]>> => {
  return await axios.get(GET_MARKET_VOTES, header);
};