import ApiService from '@/services/ApiService'
import type { ApiResponse } from '@/@types/auth'
import type {
    User,
    GetUsersListResponse,
    GetUserDetailResponse,
} from '@/app/(protected-pages)/users/user-list/types'

export type CreateUserPayload = {
    email: string
    role: string
    name: string
    country: string
    gender: 'MALE' | 'FEMALE' | 'OTHER'
}

export type UpdateUserPayload = {
    role?: string
    name?: string
    country?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER'
}

export type CreateSalesAgentPayload = CreateUserPayload & {
    commissionAmount: number
    monthlySalesGoal: number
}

export type UpdateSalesAgentPayload = CreateSalesAgentPayload

export type UserListParams = {
    page?: number
    perPage?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    search?: string
    accessToken?: string
    roleType?: string[]
}

export type UpdateProfilePayload = {
    name?: string
    country?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER'
}

export const userService = {
    getList: async (params?: UserListParams) => {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.set('page', String(params.page))
        if (params?.perPage) searchParams.set('perPage', String(params.perPage))
        if (params?.orderBy) searchParams.set('orderBy', params.orderBy)
        if (params?.orderDirection)
            searchParams.set('orderDirection', params.orderDirection)
        if (params?.search) searchParams.set('search', params.search)
        if (params?.roleType) searchParams.set('roleType', params.roleType.join(','))
        const query = searchParams.toString()
        const url = `/admin/user/list${query ? `?${query}` : ''}`

        const headers: Record<string, string> = {}
        if (params?.accessToken) {
            headers.Authorization = `Bearer ${params.accessToken}`
        }

        const res = await ApiService.fetchDataWithAxios<GetUsersListResponse>({
            url,
            method: 'GET',
            headers,
        })
        return res
    },

    getOne: async (userId: string, accessToken?: string) => {
        const headers: Record<string, string> = {}
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`
        }

        const res =
            await ApiService.fetchDataWithAxios<GetUserDetailResponse>({
                url: `/admin/user/get/${userId}`,
                method: 'GET',
                headers,
            })
        return res
    },

    create: async (payload: CreateUserPayload) => {
        const res = await ApiService.fetchDataWithAxios<
            ApiResponse<{ _id: string }>
        >({
            url: '/admin/user/create',
            method: 'POST',
            data: payload,
        })
        return res
    },

    update: async (userId: string, payload: UpdateUserPayload) => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<unknown>>({
            url: `/admin/user/update/${userId}`,
            method: 'PUT',
            data: payload,
        })
        return res
    },

    updateStatus: async (userId: string, status: 'ACTIVE' | 'INACTIVE') => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<unknown>>({
            url: `/admin/user/update/${userId}/status`,
            method: 'PATCH',
            data: { status },
        })
        return res
    },

    createSalesAgent: async (payload: CreateSalesAgentPayload) => {
        const res = await ApiService.fetchDataWithAxios<
            ApiResponse<{ _id: string }>
        >({
            url: '/admin/user/create/sales-agent',
            method: 'POST',
            data: payload,
        })
        return res
    },

    updateSalesAgent: async (
        userId: string,
        payload: UpdateSalesAgentPayload,
    ) => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<unknown>>({
            url: `/admin/user/update/sales-agent/${userId}`,
            method: 'PUT',
            data: payload,
        })
        return res
    },

    getProfile: async (accessToken?: string) => {
        const headers: Record<string, string> = {}
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`
        }

        const res = await ApiService.fetchDataWithAxios<
            ApiResponse<User> & { data: User }
        >({
            url: '/shared/user/profile',
            method: 'GET',
            headers,
        })
        return res
    },

    updateProfile: async (payload: UpdateProfilePayload) => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<unknown>>({
            url: '/shared/user/profile/update',
            method: 'PUT',
            data: payload,
        })
        return res
    },
}
