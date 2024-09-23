export const HOST = process.env.NEXT_PUBLIC_BACKEND_URL;

export const AUTH_ROUTE = `${HOST}/auth`;
export const VOTE_ROUTE = `${HOST}/voting`;

export const GET_AUTH_ME_ROUTE = `${AUTH_ROUTE}/me`;
export const POST_AUTH_CHECK_INVITE_CODE = `${AUTH_ROUTE}/invite-code`;

export const GET_MARKET_VOTES = `${VOTE_ROUTE}/votes`;
