import axios, { AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';

const ApiService: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    cancelToken: axios.CancelToken.source().token,
});

export default ApiService;
