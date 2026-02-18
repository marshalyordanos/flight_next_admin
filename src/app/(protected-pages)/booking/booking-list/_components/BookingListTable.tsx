'use client'
import { useMemo, useCallback } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import { TbEye } from 'react-icons/tb'
import { useBookingListStore } from '../_store/bookingListStore'
import { useRouter } from 'next/navigation'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import type { Booking } from '../_store/bookingListStore'

const statusColor: Record<string, string> = {
    PAID: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    PENDING:
        'bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900',
    CANCELED: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const TravellerColumn = ({ row }: { row: Booking }) => {
    const t = row.travellerInfo?.[0] || {}
    return (
        <span>
            {t.prefix && t.prefix !== '' ? t.prefix + '.' : ''}{' '}
            {t.fullName || '-'}
        </span>
    )
}
const CountryColumn = ({ row }: { row: Booking }) => {
    const t = row.travellerInfo?.[0] || {}
    return <span>{t.passportIssuingCountry || '-'}</span>
}
const EmailColumn = ({ row }: { row: Booking }) => {
    const t = row.travellerInfo?.[0] || {}
    return <span>{t.email || '-'}</span>
}
const GenderColumn = ({ row }: { row: Booking }) => {
    const t = row.travellerInfo?.[0] || {}
    return <span>{t.gender || '-'}</span>
}
const PhoneColumn = ({ row }: { row: Booking }) => {
    const t = row.travellerInfo?.[0] || {}
    return <span>{t.phoneNumber || '-'}</span>
}
const PassengerTypeColumn = ({ row }: { row: Booking }) => {
    const t = row.travellerInfo?.[0] || {}
    return <span>{t.passengerType || '-'}</span>
}

const ActionColumn = ({ onViewDetail }: { onViewDetail: () => void }) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="View">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

interface BookingListTableProps {
    bookingListTotal: number
    pageIndex?: number
    pageSize?: number
    totalPage?: number
    orderBy?: string
    orderDirection?: string
    availableOrderBy?: string[]
    availableOrderDirection?: string[]
    onPaginationChange: (page: number) => void
    onSelectChange: (perPage: number) => void
    onSort: (sort: { key: string; order: string }) => void
}

const BookingListTable: React.FC<BookingListTableProps> = ({
    bookingListTotal,
    pageIndex = 1,
    pageSize = 10,
    // totalPage = 1, // removed unused
    // orderBy = 'createdAt', // removed unused
    // orderDirection = 'asc', // removed unused
    // availableOrderBy = ['createdAt'], // removed unused
    // availableOrderDirection = ['asc', 'desc'], // removed unused
    onPaginationChange,
    onSelectChange,
    onSort,
}) => {
    const router = useRouter()
    const bookingList = useBookingListStore((state) => state.bookingList)
    const selectedBooking = useBookingListStore(
        (state) => state.selectedBooking,
    )
    const isInitialLoading = useBookingListStore(
        (state) => state.initialLoading,
    )
    const setSelectedBooking = useBookingListStore(
        (state) => state.setSelectedBooking,
    )

    const setSelectAllBooking = useBookingListStore(
        (state) => state.setSelectAllBooking,
    )
    // const { onAppendQueryParams } = useAppendQueryParams() // removed unused

    const handleViewDetails = useCallback(
        (booking: Booking) => {
            router.push(`/booking/booking-detail/${booking._id}`)
        },
        [router],
    )

    const columns: ColumnDef<Booking>[] = useMemo(
        () => [
            {
                header: 'Traveller Name',
                accessorKey: 'travellerInfo',
                cell: (props) => <TravellerColumn row={props.row.original} />,
            },
            {
                header: 'Country',
                accessorKey: 'travellerInfo',
                cell: (props) => <CountryColumn row={props.row.original} />,
            },
            {
                header: 'Email',
                accessorKey: 'travellerInfo',
                cell: (props) => <EmailColumn row={props.row.original} />,
            },
            {
                header: 'Gender',
                accessorKey: 'travellerInfo',
                cell: (props) => <GenderColumn row={props.row.original} />,
            },
            {
                header: 'Phone Number',
                accessorKey: 'travellerInfo',
                cell: (props) => <PhoneColumn row={props.row.original} />,
            },
            {
                header: 'Passenger Type',
                accessorKey: 'passengerType',
                cell: (props) => (
                    <PassengerTypeColumn row={props.row.original} />
                ),
            },

            {
                header: 'Booker Type',
                accessorKey: 'bookerType',
            },
            {
                header: 'PNR',
                accessorKey: 'pnr',
            },
            {
                header: 'User Payment Expiration Date',
                accessorKey: 'userPaymentExpirationDate',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span>
                            {row.userPaymentExpirationDate
                                ? new Date(
                                      row.userPaymentExpirationDate,
                                  ).toLocaleDateString('en-US', {
                                      month: '2-digit',
                                      day: '2-digit',
                                      year: 'numeric',
                                  })
                                : '-'}
                        </span>
                    )
                },
            },
            {
                header: 'Payment Status',
                accessorKey: 'paymentStatus',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <Tag
                            className={
                                statusColor[row.paymentStatus] ||
                                'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                            }
                        >
                            <span className="capitalize">
                                {row.paymentStatus}
                            </span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Amount',
                accessorKey: 'basePayment',
            },
            {
                header: 'Currency',
                accessorKey: 'userPaymentCurrency',
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span>
                            {new Date(row.createdAt).toLocaleDateString()}
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
            },
        ],
        [handleViewDetails],
    )

    // Use parent-provided handlers for pagination, select, and sort

    const handleRowSelect = (checked: boolean, row: Booking) => {
        setSelectedBooking(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Booking>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllBooking(originalRows)
        } else {
            setSelectAllBooking([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={bookingList}
            noData={bookingList.length === 0}
            loading={isInitialLoading}
            pagingData={{
                total: bookingListTotal,
                pageIndex,
                pageSize,
            }}
            checkboxChecked={(row) =>
                selectedBooking.some((selected) => selected._id === row._id)
            }
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={(sort) =>
                onSort({ key: String(sort.key), order: sort.order })
            }
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default BookingListTable
