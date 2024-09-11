import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  GET_AUTH_ME_ROUTE,
  POST_AUTH_CHECK_INVITE_CODE,
} from "@/constants/api-routes";
import {
  AuthApplyInviteCodeRequest,
  UserData
} from "@/types/user";
import { ResponseData } from "@/types/response";

export const authUserInfo = async (
  header: AxiosRequestConfig
): Promise<AxiosResponse<ResponseData<UserData>>> => {
  return await axios.get(GET_AUTH_ME_ROUTE, header);
};

export const authApplyInviteCode = async (
  req: AuthApplyInviteCodeRequest,
  header: AxiosRequestConfig
): Promise<AxiosResponse<ResponseData<null>>> => {
  return await axios.post(POST_AUTH_CHECK_INVITE_CODE, req, header);
};