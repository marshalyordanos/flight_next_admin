import { create } from 'zustand'

export type Booking = {
    _id: string
    deleted: boolean
    createdAt: string
    updatedAt: string
    bookedBy: string
    pnr: string
    bookerType: string
    travellerInfo: Array<{ fullName: string }>
    paymentStatus: string
    basePayment: string
    userPaymentCurrency: string
    [key: string]: any
}

export type BookingListFilter = {
    search?: string
    paymentStatus?: string
    orderBy?: string
    orderDirection?: string
    page?: number
    perPage?: number
}

export type BookingListState = {
    initialLoading: boolean
    bookingList: Booking[]
    selectedBooking: Partial<Booking>[]
    filterData: BookingListFilter
}

type BookingListAction = {
    setBookingList: (bookingList: Booking[]) => void
    setSelectedBooking: (checked: boolean, booking: Booking) => void
    setSelectAllBooking: (booking: Booking[]) => void
    setInitialLoading: (payload: boolean) => void
    setFilterData: (payload: BookingListFilter) => void
}

const initialFilterData: BookingListFilter = {
    search: '',
    paymentStatus: '',
    orderBy: 'createdAt',
    orderDirection: '',
    page: 1,
    perPage: 10,
}

const initialState: BookingListState = {
    initialLoading: true,
    bookingList: [],
    selectedBooking: [],
    filterData: initialFilterData,
}

export const useBookingListStore = create<BookingListState & BookingListAction>(
    (set) => ({
        ...initialState,
        setBookingList: (bookingList) => set(() => ({ bookingList })),
        setSelectedBooking: (checked, row) =>
            set((state) => {
                const prevData = state.selectedBooking
                if (checked) {
                    return { selectedBooking: [...prevData, row] }
                } else {
                    return {
                        selectedBooking: prevData.filter(
                            (b) => b._id !== row._id,
                        ),
                    }
                }
            }),
        setSelectAllBooking: (bookings) =>
            set(() => ({ selectedBooking: bookings })),
        setInitialLoading: (payload) =>
            set(() => ({ initialLoading: payload })),
        setFilterData: (payload) => set(() => ({ filterData: payload })),
    }),
)
