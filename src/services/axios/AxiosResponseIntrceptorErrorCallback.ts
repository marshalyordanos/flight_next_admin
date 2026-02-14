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

    const errorData = error.response?.data
    let errorMessage: string
    if (typeof errorData === 'object' && errorData !== null) {
        try {
            const str = JSON.stringify(errorData)
            errorMessage = str === '{}' ? error.message ?? 'Unknown error' : str
        } catch {
            errorMessage = error.message ?? 'Unknown error'
        }
    } else {
        errorMessage =
            (errorData as string) ?? error.message ?? 'Unknown error'
    }
    console.error('API Error:', errorMessage)
}

export default AxiosResponseIntrceptorErrorCallback
