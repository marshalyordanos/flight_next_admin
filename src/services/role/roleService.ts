import ApiService from '@/services/ApiService'
import type {
    Role,
    RoleListParams,
    CreateRolePayload,
    UpdateRolePayload,
} from '@/@types/role'
import type { ApiResponse } from '@/@types/auth'

type RoleListResponse = Role[]
type PaginationMeta = {
    pagination?: {
        page: number
        perPage: number
        total: number
        totalPage: number
        orderBy?: string
        orderDirection?: string
    }
}

export const roleService = {
    getList: async (params?: RoleListParams) => {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.set('page', String(params.page))
        if (params?.perPage) searchParams.set('perPage', String(params.perPage))
        if (params?.orderBy) searchParams.set('orderBy', params.orderBy)
        if (params?.orderDirection)
            searchParams.set('orderDirection', params.orderDirection)
        if (params?.search) searchParams.set('search', params.search)

        const query = searchParams.toString()
        const url = `/admin/role/list${query ? `?${query}` : ''}`

        const res = await ApiService.fetchDataWithAxios<
            ApiResponse<RoleListResponse> & PaginationMeta
        >({
            url,
            method: 'GET',
        })
        return res
    },

    getOne: async (roleId: string) => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<Role>>({
            url: `/admin/role/get/${roleId}`,
            method: 'GET',
        })
        return res
    },

    create: async (payload: CreateRolePayload) => {
        const res = await ApiService.fetchDataWithAxios<
            ApiResponse<{ _id: string }>
        >({
            url: '/admin/role/create',
            method: 'POST',
            data: payload,
        })
        return res
    },

    update: async (roleId: string, payload: UpdateRolePayload) => {
        const res = await ApiService.fetchDataWithAxios<
            ApiResponse<{ _id: string }>
        >({
            url: `/admin/role/update/${roleId}`,
            method: 'PUT',
            data: payload,
        })
        return res
    },

    setActive: async (roleId: string) => {
        const res = await ApiService.fetchDataWithAxios({
            url: `/admin/role/update/${roleId}/active`,
            method: 'PATCH',
        })
        return res
    },

    setInactive: async (roleId: string) => {
        const res = await ApiService.fetchDataWithAxios({
            url: `/admin/role/update/${roleId}/inactive`,
            method: 'PATCH',
        })
        return res
    },

    delete: async (roleId: string) => {
        const res = await ApiService.fetchDataWithAxios({
            url: `/admin/role/delete/${roleId}`,
            method: 'DELETE',
        })
        return res
    },
}
