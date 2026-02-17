import  { AdminApiService } from '@/services/ApiService'
import type { ApiResponse } from '@/@types/auth'

export type Country = {
    _id: string
    deleted: boolean
    createdAt: string
    updatedAt: string
    name: string
    alpha2Code: string
    alpha3Code: string
    numericCode: string
    fipsCode: string
    phoneCode: string[]
    continent: string
    timeZone: string
    currency: string
}

export type CountryListParams = {
    page?: number
    perPage?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    search?: string
    accessToken?: string
}

export type GetCountriesListResponse = ApiResponse<Country[]> & {
    data: Country[]
}

export const countryService = {
    getList: async (params?: CountryListParams) => {
        const searchParams = new URLSearchParams()

        if (params?.page) searchParams.set('page', String(params.page))
        if (params?.perPage) searchParams.set('perPage', String(params.perPage))
        if (params?.orderBy) searchParams.set('orderBy', params.orderBy)
        if (params?.orderDirection)
            searchParams.set('orderDirection', params.orderDirection)
        if (params?.search) searchParams.set('search', params.search)

        const query = searchParams.toString()
        const url = `/system/country/list${query ? `?${query}` : ''}`

        const headers: Record<string, string> = {}
        if (params?.accessToken) {
            headers.Authorization = `Bearer ${params.accessToken}`
        }

        const res =
            await AdminApiService.fetchDataWithAxios<GetCountriesListResponse>({
                url,
                method: 'GET',
                headers,
            })

        return res
    },
}
