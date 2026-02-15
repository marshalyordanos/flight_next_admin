import ApiService from '@/services/ApiService'
import type { ApiResponse } from '@/@types/auth'

export type ConfigurationValueResponse = {
    statusCode: number
    message: string
    data: { value: number }
}

export const configurationService = {
    getMarkupRate: async () => {
        const res = await ApiService.fetchDataWithAxios<ConfigurationValueResponse>({
            url: '/admin/configuration/get/markup-rate',
            method: 'GET',
        })
        return res
    },

    getTaxRate: async () => {
        const res = await ApiService.fetchDataWithAxios<ConfigurationValueResponse>({
            url: '/admin/configuration/get/tax-rate',
            method: 'GET',
        })
        return res
    },

    createOrUpdateMarkupRate: async (value: number) => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<unknown>>({
            url: '/admin/configuration/markup-rate/create-or-update',
            method: 'POST',
            data: { value },
        })
        return res
    },

    createOrUpdateTaxRate: async (value: number) => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<unknown>>({
            url: '/admin/configuration/tax-rate/create-or-update',
            method: 'POST',
            data: { value },
        })
        return res
    },
}
