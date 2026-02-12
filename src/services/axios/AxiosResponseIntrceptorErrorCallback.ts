import type { AxiosError } from 'axios'
import { tokenStorage } from '@/utils/storage'
import appConfig from '@/configs/app.config'

const publicPaths = ['/public/auth']

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''

    if (status === 401 && !publicPaths.some((p) => requestUrl.includes(p))) {
        tokenStorage.clear()
        if (typeof window !== 'undefined') {
            window.location.href = appConfig.unAuthenticatedEntryPath
        }
    }

    console.error('API Error:', error.response?.data ?? error.message)
}

export default AxiosResponseIntrceptorErrorCallback
