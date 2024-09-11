export const HOST = process.env.NEXT_PUBLIC_BACKEND_URL;

export const AUTH_ROUTE = `${HOST}/auth`;

export const GET_AUTH_ME_ROUTE = `${AUTH_ROUTE}/me`;
export const POST_AUTH_CHECK_INVITE_CODE = `${AUTH_ROUTE}/invite-code`;
