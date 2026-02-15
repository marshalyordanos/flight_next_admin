import axios from 'axios'
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestIntrceptorConfigCallback'
// import appConfig from '@/configs/app.config'
import type { AxiosError } from 'axios'

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: 'https://flight.yonashalefom.com/api/v1',
    // withCredentials: true,
    headers: {
        'x-api-key': 'v8VB0yY887lMpTA2VJMV:zeZbtGTugBTn3Qd5UXtSZBwt7gn3bg',
    },
})

const AdminAxiosBase = axios.create({
    timeout: 60000,
    baseURL: 'https://flight.yonashalefom.com/api/v1',
    // withCredentials: true,
    headers: {
        'x-api-key': 'OgXYkQyOtP7Zl5uCbKd8:3kh0hW7pIAH3wW9DwUGrP8Y5RW9Ywv',
    },
})

AxiosBase.interceptors.request.use(
    (config) => {
        return AxiosRequestIntrceptorConfigCallback(config)
    },
    (error) => {
        return Promise.reject(error)
    },
)

AxiosBase.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

AdminAxiosBase.interceptors.request.use(
    (config) => {
        return AxiosRequestIntrceptorConfigCallback(config)
    },
    (error) => {
        return Promise.reject(error)
    },
)

AdminAxiosBase.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

export {  AdminAxiosBase }

export default AxiosBase