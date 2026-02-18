'use client'

import { bookingService } from '@/services/booking/bookingService'
import React, { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import Tag from '@/components/ui/Tag'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import {
    HiOutlineUser,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineCalendar,
    HiOutlineIdentification,
    HiOutlineCurrencyDollar,
} from 'react-icons/hi'

const labelClass = 'font-semibold text-gray-600 dark:text-gray-300 text-sm mb-1'
const valueClass = 'text-gray-900 dark:text-gray-100 text-base mb-2 break-all'

const BookingDetail = ({ bookingId }: { bookingId: string }) => {
    const [bookingDetail, setBookingDetail] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    useEffect(() => {
        let cancelled = false
        setIsLoading(true)
        bookingService
            .getSingleBooking(bookingId)
            .then((res: any) => {
                if (!cancelled) {
                    setBookingDetail(res?.data)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setBookingDetail(null)
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [bookingId])

    if (isLoading) {
        return (
            <Loading loading={true} type="cover">
                <div className="h-64" />
            </Loading>
        )
    }
    if (!bookingDetail) {
        return (
            <div className="text-center py-10 text-gray-500">
                No booking details found.
            </div>
        )
    }

    const traveler = bookingDetail.travellerInfo?.[0] || {}
    const bookedBy = bookingDetail.bookedBy || {}

    return (
        <div className="max-w-4xl w-full mx-auto py-8">
            <AdaptiveCard>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-4 mb-4">
                    <div>
                        <div className="text-2xl font-bold mb-1">
                            Booking Details
                        </div>

                        <div className="mt-2">
                            <Tag className="bg-emerald-200 text-gray-900 px-2 py-1 mr-2">
                                {bookingDetail.paymentStatus}
                            </Tag>
                            <Tag className="bg-blue-100 text-blue-900 px-2 py-1">
                                {bookingDetail.bookerType}
                            </Tag>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-sm text-gray-500">
                            Created:{' '}
                            {new Date(bookingDetail.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                            Updated:{' '}
                            {new Date(bookingDetail.updatedAt).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Booker Info */}
                <div className="mb-6">
                    <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <HiOutlineUser /> Booker Information
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className={labelClass}>Name</div>
                            <div className={valueClass}>
                                {bookedBy.name || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Email</div>
                            <div className={valueClass}>
                                {bookedBy.email || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Username</div>
                            <div className={valueClass}>
                                {bookedBy.username || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Status</div>
                            <div className={valueClass}>
                                {bookedBy.status || '-'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <HiOutlineUser /> Traveler Information
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className={labelClass}>Full Name</div>
                            <div className={valueClass}>
                                {traveler.fullName || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Email</div>
                            <div className={valueClass}>
                                {traveler.email || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Gender</div>
                            <div className={valueClass}>
                                {traveler.gender || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Phone Number</div>
                            <div className={valueClass}>
                                {traveler.phoneNumber || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Passenger Type</div>
                            <div className={valueClass}>
                                {traveler.passengerType || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Date of Birth</div>
                            <div className={valueClass}>
                                {traveler.dob
                                    ? new Date(
                                          traveler.dob,
                                      ).toLocaleDateString()
                                    : '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Passport Number</div>
                            <div className={valueClass}>
                                {traveler.passportNumber || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>
                                Passport Issuing Country
                            </div>
                            <div className={valueClass}>
                                {traveler.passportIssuingCountry || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Passport Expiry</div>
                            <div className={valueClass}>
                                {traveler.passportExpiry || '-'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <HiOutlineIdentification /> Booking Information
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className={labelClass}>PNR</div>
                            <div className={valueClass}>
                                {bookingDetail.pnr || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Booker Type</div>
                            <div className={valueClass}>
                                {bookingDetail.bookerType || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Active</div>
                            <div className={valueClass}>
                                {bookingDetail.isActive ? 'Yes' : 'No'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Deleted</div>
                            <div className={valueClass}>
                                {bookingDetail.deleted ? 'Yes' : 'No'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <HiOutlineCurrencyDollar /> Payment Information
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className={labelClass}>Base Payment</div>
                            <div className={valueClass}>
                                {bookingDetail.basePayment || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Payment Status</div>
                            <div className={valueClass}>
                                {bookingDetail.paymentStatus || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Amount in ETB</div>
                            <div className={valueClass}>
                                {bookingDetail.paymentAmountInETB || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>
                                Amount in Preferred Currency
                            </div>
                            <div className={valueClass}>
                                {bookingDetail.paymentAmountInPreferredCurrency ||
                                    '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>
                                User Payment Currency
                            </div>
                            <div className={valueClass}>
                                {bookingDetail.userPaymentCurrency || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>
                                User Payment Expiration Date
                            </div>
                            <div className={valueClass}>
                                {bookingDetail.userPaymentExpirationDate
                                    ? new Date(
                                          bookingDetail.userPaymentExpirationDate,
                                      ).toLocaleString()
                                    : '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Markup Rate (ETB)</div>
                            <div className={valueClass}>
                                {bookingDetail.markupRateInETB || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Commission (ETB)</div>
                            <div className={valueClass}>
                                {bookingDetail.paymentCommissionInETB || '-'}
                            </div>
                        </div>
                        <div>
                            <div className={labelClass}>Total Price</div>
                            <div className={valueClass}>
                                {bookingDetail.airPricingSolutionTotalPrice ||
                                    '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </AdaptiveCard>
        </div>
    )
}

export default BookingDetail
