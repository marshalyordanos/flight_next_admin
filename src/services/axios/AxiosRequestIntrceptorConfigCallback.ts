import type { InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/utils/storage'

const AxiosRequestIntrceptorConfigCallback = (
    config: InternalAxiosRequestConfig,
) => {
    const token = tokenStorage.getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}

export default AxiosRequestIntrceptorConfigCallback
