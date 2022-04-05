import axios from "axios";
import { ERROR_MSG_SERVER_CONNECT_FAIL } from "./commonErrorMessage";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 5000,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    console.log("400");
                    break;
                case 401:
                    console.log("401");
                    break;
                case 500:
                    console.log("500");
                    break
                default:
                    console.log(error.message)
            }
        }
        if (!window.navigator.onLine) {
            alert(ERROR_MSG_SERVER_CONNECT_FAIL);
            return;
        }
        return Promise.reject(error);
    }
);