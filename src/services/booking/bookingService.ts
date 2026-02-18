import ApiService from '@/services/ApiService'

import type { BookingDetailType } from '@/app/@types/bookingDetail'
// Booking detail response type for detail API
export type BookingDetailResponse = {
    statusCode: number
    message: string
    data: BookingDetailType
}

export type BookingValueResponse = {
    statusCode: number
    message: string
    data: { value: number }
}

export const bookingService = {
    getAllBookings: async (params?: Record<string, string>) => {
        let url = '/admin/bookings/get-all'
        if (params) {
            const query = Object.entries(params)
                .filter(([, v]) => v !== undefined && v !== null && v !== '')
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
        const res = await ApiService.fetchDataWithAxios<
            import('@/services/booking/bookingService').BookingDetailResponse
        >({
            url: `/admin/bookings/get/${bookingId}`,
            method: 'GET',
        })
        return res
    },

    adminBookFlight: async (value: number) => {
        const res = await ApiService.fetchDataWithAxios<unknown>({
            url: '/admin/bookings/flight',
            method: 'POST',
            data: { value },
        })
        return res
    },
}
