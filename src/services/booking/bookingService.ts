import ApiService from '@/services/ApiService'
import type { ApiResponse } from '@/@types/auth'

export type BookingValueResponse = {
    statusCode: number
    message: string
    data: { value: number }
}

export const bookingService = {
    getAllBookings: async (params?: Record<string, any>) => {
        let url = '/admin/bookings/get-all'
        if (params) {
            const query = Object.entries(params)
                .filter(([_, v]) => v !== undefined && v !== null && v !== '')
                .map(
                    ([k, v]) =>
                        `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
                )
                .join('&')
            if (query) url += `?${query}`
        }
        const res = await ApiService.fetchDataWithAxios<BookingValueResponse>({
            url,
            method: 'GET',
        })
        return res
    },

    getSingleBooking: async (bookingId: string) => {
        const res = await ApiService.fetchDataWithAxios<BookingValueResponse>({
            url: `/admin/bookings/get/${bookingId}`,
            method: 'GET',
        })
        return res
    },

    adminBookFlight: async (value: number) => {
        const res = await ApiService.fetchDataWithAxios<ApiResponse<unknown>>({
            url: '/admin/bookings/flight',
            method: 'POST',
            data: { value },
        })
        return res
    },
}
