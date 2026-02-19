'use client'

import { useEffect } from 'react'
import BookingListTableTools from './BookingListTableTools'
import { useSearchParams } from 'next/navigation'
import { useBookingListStore } from '../_store/bookingListStore'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import React from 'react'
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
            .then((res) => {
                // Integrate backend pagination and filter metadata
                const bookings = Array.isArray(res)
                    ? res
                    : Array.isArray(res.data)
                      ? res.data
                      : []
                // Accept both _metadata or metadata for pagination (backend may differ)
                type Pagination = {
                    orderBy?: string
                    orderDirection?: string
                    page?: number
                    perPage?: number
                    [key: string]: unknown
                }
                let pagination: Pagination = {}
                if (
                    res &&
                    typeof res === 'object' &&
                    '_metadata' in res &&
                    res._metadata &&
                    typeof res._metadata === 'object' &&
                    'pagination' in res._metadata &&
                    typeof res._metadata.pagination === 'object'
                ) {
                    pagination = res._metadata.pagination as Pagination
                } else if (
                    res &&
                    typeof res === 'object' &&
                    'metadata' in res &&
                    res.metadata &&
                    typeof res.metadata === 'object' &&
                    'pagination' in res.metadata &&
                    typeof res.metadata.pagination === 'object'
                ) {
                    pagination = res.metadata.pagination as Pagination
                }
                if (!cancelled) {
                    setBookingList(bookings)
                    setFilterData({
                        search: params.search || '',
                        paymentStatus: params.paymentStatus || '',
                        orderBy: pagination.orderBy || 'createdAt',
                        orderDirection: pagination.orderDirection || '',
                        page: pagination.page || 1,
                        perPage: pagination.perPage || 10,
                        total:
                            typeof pagination.total === 'number'
                                ? pagination.total
                                : bookings.length,
                        totalPage:
                            typeof pagination.totalPage === 'number'
                                ? pagination.totalPage
                                : 1,
                        availableOrderBy: Array.isArray(
                            pagination.availableOrderBy,
                        )
                            ? pagination.availableOrderBy
                            : ['createdAt'],
                        availableOrderDirection: Array.isArray(
                            pagination.availableOrderDirection,
                        )
                            ? pagination.availableOrderDirection
                            : ['asc', 'desc'],
                        availableSearch: Array.isArray(
                            pagination.availableSearch,
                        )
                            ? pagination.availableSearch
                            : [],
                    })
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
                            bookingListTotal={Number(filterData.total ?? total)}
                            pageIndex={Number(filterData.page ?? 1)}
                            pageSize={Number(filterData.perPage ?? 10)}
                            totalPage={Number(filterData.totalPage ?? 1)}
                            orderBy={String(filterData.orderBy ?? 'createdAt')}
                            orderDirection={String(
                                filterData.orderDirection ?? 'asc',
                            )}
                            availableOrderBy={
                                Array.isArray(filterData.availableOrderBy)
                                    ? filterData.availableOrderBy
                                    : []
                            }
                            availableOrderDirection={
                                Array.isArray(
                                    filterData.availableOrderDirection,
                                )
                                    ? filterData.availableOrderDirection
                                    : []
                            }
                            onPaginationChange={(page: number) => {
                                const params = new URLSearchParams(
                                    window.location.search,
                                )
                                params.set('page', String(page))
                                window.location.search = params.toString()
                            }}
                            onSelectChange={(perPage: number) => {
                                const params = new URLSearchParams(
                                    window.location.search,
                                )
                                params.set('perPage', String(perPage))
                                params.set('page', '1')
                                window.location.search = params.toString()
                            }}
                            onSort={({
                                key,
                                order,
                            }: {
                                key: string
                                order: string
                            }) => {
                                const params = new URLSearchParams(
                                    window.location.search,
                                )
                                params.set('orderBy', String(key))
                                params.set('orderDirection', String(order))
                                window.location.search = params.toString()
                            }}
                        />
                    </Loading>
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default BookingList
