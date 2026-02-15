import AxiosBase, { AdminAxiosBase } from './axios/AxiosBase'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const ApiService = {
    fetchDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ) {
        return new Promise<Response>((resolve, reject) => {
            AxiosBase(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },
}

const AdminApiService = {
    fetchDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ) {
        return new Promise<Response>((resolve, reject) => {
            AdminAxiosBase(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },
}

export { AdminApiService }

export default ApiService
