'use client'

import { useEffect } from 'react'
import BookingListTableTools from './BookingListTableTools'
import { useSearchParams } from 'next/navigation'
import { useBookingListStore } from '../_store/bookingListStore'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import BookingListTable from './BookingListTable'
import Loading from '@/components/shared/Loading'
import { bookingService } from '@/services/booking/bookingService'

const BookingList = () => {
    const setBookingList = useBookingListStore((state) => state.setBookingList)
    const setInitialLoading = useBookingListStore(
        (state) => state.setInitialLoading,
    )
    const setFilterData = useBookingListStore((state) => state.setFilterData)
    const bookingList = useBookingListStore((state) => state.bookingList)
    const isInitialLoading = useBookingListStore(
        (state) => state.initialLoading,
    )
    const filterData = useBookingListStore((state) => state.filterData)
    const total = bookingList.length
    const searchParams = useSearchParams()

    useEffect(() => {
        let cancelled = false
        setInitialLoading(true)

        const params: Record<string, string> = {}
        for (const [key, value] of searchParams.entries()) {
            if (value !== undefined && value !== null) {
                params[key] = value
            }
        }

        setFilterData({
            search: params.search || '',
            paymentStatus: params.paymentStatus || '',
            orderBy: params.orderBy || 'createdAt',
            orderDirection: params.orderDirection || '',
            page: params.page ? Number(params.page) : 1,
            perPage: params.perPage ? Number(params.perPage) : 10,
        })

        bookingService
            .getAllBookings(params)
            .then((res: any) => {
                console.log(res, 'backend responseopenspnfsef')
                const bookings = Array.isArray(res)
                    ? res
                    : Array.isArray(res.data)
                      ? res.data
                      : []
                if (!cancelled) {
                    setBookingList(bookings)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setBookingList([])
                }
            })
            .finally(() => {
                if (!cancelled) setInitialLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [searchParams, setBookingList, setInitialLoading, setFilterData])

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <BookingListTableTools />
                    <Loading loading={isInitialLoading} type="cover">
                        <BookingListTable
                            bookingListTotal={total}
                            pageIndex={filterData.page || 1}
                            pageSize={filterData.perPage || 10}
                        />
                    </Loading>
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default BookingList
