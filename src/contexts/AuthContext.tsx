'use client'

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth/authService'
import { tokenStorage } from '@/utils/storage'
import type { UserProfile } from '@/@types/auth'
import type { SignInCredential } from '@/@types/auth'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'

type AuthState = {
    user: UserProfile | null
    accessToken: string | null
    refreshToken: string | null
    isLoading: boolean
}

type AuthContextValue = AuthState & {
    signIn: (credentials: SignInCredential, callbackUrl?: string) => Promise<{ error?: string }>
    signOut: () => void
    fetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return ctx
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter()
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: tokenStorage.getAccessToken(),
        refreshToken: tokenStorage.getRefreshToken(),
        isLoading: true,
    })

    const fetchUser = useCallback(async () => {
        const token = tokenStorage.getAccessToken()
        if (!token) {
            setState((s) => ({ ...s, user: null, isLoading: false }))
            return
        }
        try {
            const res = await authService.getProfile()
            setState((s) => ({
                ...s,
                user: res.data,
                isLoading: false,
            }))
        } catch {
            tokenStorage.clear()
            setState((s) => ({
                ...s,
                user: null,
                accessToken: null,
                refreshToken: null,
                isLoading: false,
            }))
        }
    }, [])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const signIn = useCallback(
        async (
            credentials: SignInCredential,
            callbackUrl?: string,
        ): Promise<{ error?: string }> => {
            try {
                const res = await authService.login(credentials)
                const { accessToken, refreshToken, expiresIn } = res.data
                authService.setTokens(accessToken, refreshToken, expiresIn)

                const profileRes = await authService.getProfile()

                setState({
                    user: profileRes.data,
                    accessToken,
                    refreshToken,
                    isLoading: false,
                })

                const redirect = callbackUrl || appConfig.authenticatedEntryPath
                router.push(redirect)
                return {}
            } catch (err: unknown) {
                const message =
                    (err as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message ?? 'Invalid credentials'
                return { error: message }
            }
        },
        [router],
    )

    const signOut = useCallback(() => {
        authService.clearTokens()
        setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
        })
        const url = new URL(appConfig.unAuthenticatedEntryPath, window.location.origin)
        const redirectUrl = typeof window !== 'undefined' ? window.location.pathname : ''
        if (redirectUrl && redirectUrl !== '/') {
            url.searchParams.set(REDIRECT_URL_KEY, redirectUrl)
        }
        window.location.href = url.toString()
    }, [])

    const value: AuthContextValue = {
        ...state,
        signIn,
        signOut,
        fetchUser,
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}
