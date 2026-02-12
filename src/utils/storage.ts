import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants/auth.constant'

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null
    return null
}

const setCookie = (
    name: string,
    value: string,
    maxAgeSeconds: number = 60 * 60 * 24 * 7, // 7 days
) => {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`
}

const removeCookie = (name: string) => {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=; path=/; max-age=0`
}

export const tokenStorage = {
    getAccessToken: () => getCookie(AUTH_TOKEN_KEY),
    setAccessToken: (token: string, expiresInSeconds?: number) => {
        setCookie(AUTH_TOKEN_KEY, token, expiresInSeconds ?? 60 * 60 * 24)
    },
    removeAccessToken: () => removeCookie(AUTH_TOKEN_KEY),
    getRefreshToken: () => getCookie(REFRESH_TOKEN_KEY),
    setRefreshToken: (token: string) => {
        setCookie(REFRESH_TOKEN_KEY, token)
    },
    removeRefreshToken: () => removeCookie(REFRESH_TOKEN_KEY),
    clear: () => {
        removeCookie(AUTH_TOKEN_KEY)
        removeCookie(REFRESH_TOKEN_KEY)
    },
}
