'use client'

import { useMemo, useCallback } from 'react'
// import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useUserListStore } from '../_store/userListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { User } from '../types'

type UserListTableProps = {
    userListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<string, string> = {
    ACTIVE: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    INACTIVE: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: User }) => {
    return (
        <div className="flex  items-center">
            {/* <Avatar size={40} shape="circle" /> */}
            <Link
                className="hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100"
                href={`/users/user-details/${row._id}`}
            >
                {row.name}
            </Link>
        </div>
    )
}

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
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

const UserListTable = ({
    userListTotal,
    pageIndex = 1,
    pageSize = 10,
}: UserListTableProps) => {
    const router = useRouter()

    const userList = useUserListStore((state) => state.userList)
    const selectedUser = useUserListStore((state) => state.selectedUser)
    const isInitialLoading = useUserListStore((state) => state.initialLoading)
    const setSelectedUser = useUserListStore((state) => state.setSelectedUser)
    const setSelectAllUser = useUserListStore((state) => state.setSelectAllUser)

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleEdit = useCallback(
        (user: User) => {
            router.push(`/users/user-edit/${user._id}`)
        },
        [router],
    )

    const handleViewDetails = useCallback(
        (user: User) => {
            router.push(`/users/user-details/${user._id}`)
        },
        [router],
    )

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Username',
                accessorKey: 'username',
            },
            {
                header: 'Role',
                accessorKey: 'role.name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.role?.name || '-'}
                        </span>
                    )
                },
            },
            {
                header: 'Country',
                accessorKey: 'country.name',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.country?.name || '-'}</span>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag
                                className={
                                    statusColor[row.status] ||
                                    'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                                }
                            >
                                <span className="capitalize">{row.status}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
            },
        ],
        [handleEdit, handleViewDetails],
    )

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({
            pageIndex: String(page),
        })
    }

    const handleSelectChange = (value: number) => {
        onAppendQueryParams({
            pageSize: String(value),
            pageIndex: '1',
        })
    }

    const handleSort = (sort: OnSortParam) => {
        onAppendQueryParams({
            orderBy: sort.key,
            orderDirection: sort.order || 'asc',
        })
    }

    const handleRowSelect = (checked: boolean, row: User) => {
        setSelectedUser(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<User>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllUser(originalRows)
        } else {
            setSelectAllUser([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={userList}
            noData={userList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isInitialLoading}
            pagingData={{
                total: userListTotal,
                pageIndex,
                pageSize,
            }}
            checkboxChecked={(row) =>
                selectedUser.some((selected) => selected._id === row._id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default UserListTable
