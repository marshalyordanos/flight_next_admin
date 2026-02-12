import ApiService from '@/services/ApiService'
import { tokenStorage } from '@/utils/storage'
import type {
    SignInCredential,
    ApiResponse,
    AuthLoginResponse,
    UserProfile,
} from '@/@types/auth'

export const authService = {
    login: async (credentials: SignInCredential) => {
        const res = await ApiService.fetchDataWithAxios<
            ApiResponse<AuthLoginResponse>
        >({
            url: '/public/auth/login/credential',
            method: 'POST',
            data: credentials,
        })
        return res
    },

    getProfile: async () => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<UserProfile>>(
            {
                url: '/shared/user/profile',
                method: 'GET',
            },
        )
        return res
    },

    setTokens: (accessToken: string, refreshToken: string, expiresIn?: number) => {
        tokenStorage.setAccessToken(accessToken, expiresIn)
        tokenStorage.setRefreshToken(refreshToken)
    },

    clearTokens: () => {
        tokenStorage.clear()
    },

    getAccessToken: () => tokenStorage.getAccessToken(),
}
