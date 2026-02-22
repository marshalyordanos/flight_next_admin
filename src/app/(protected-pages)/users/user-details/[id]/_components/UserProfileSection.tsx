'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import dayjs from 'dayjs'
import { HiPencil } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import type { User } from '@/app/(protected-pages)/users/user-list/types'

type UserInfoFieldProps = {
    title?: string
    value?: string
}

const UserInfoField = ({ title, value }: UserInfoFieldProps) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            {title}
        </span>
        <span className="text-sm font-medium text-gray-900 truncate">
            {value ? value : <span className="text-gray-400">-</span>}
        </span>
    </div>
)

type UserProfileSectionProps = {
    data: User
}

const badgeColor = (status?: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-50 text-green-700 border-green-200'
        case 'inactive':
            return 'bg-gray-50 text-gray-500 border-gray-200'
        case 'banned':
            return 'bg-red-50 text-red-600 border-red-200'
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200'
    }
}

const UserProfileSection = ({ data }: UserProfileSectionProps) => {
    const router = useRouter()
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDialogClose = () => setDialogOpen(false)
    const handleEdit = () => router.push(`/users/user-edit/${data._id}`)

    return (
        <Card className="w-full shadow-lg rounded-xl border border-blue-100 bg-white/95 backdrop-blur">
            <div className="flex justify-end p-2">
                <Tooltip title="Edit user">
                    <button
                        className="rounded-full hover:bg-blue-50 transition p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        type="button"
                        onClick={handleEdit}
                        aria-label="Edit User"
                    >
                        <HiPencil className="w-4 h-4 text-blue-700" />
                    </button>
                </Tooltip>
            </div>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[320px] px-5 py-6">
                <div className="flex xl:flex-col items-center gap-3">
                    <Avatar size={70} shape="circle" />
                    <h4 className="font-bold text-base text-blue-950 text-center">{data.name}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4 mt-5">
                    <UserInfoField title="Email" value={data.email} />
                    <UserInfoField title="Username" value={data.username} />
                    <div>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                            Role
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-medium text-gray-900">
                                {data.role?.name || <span className="text-gray-400">-</span>}
                            </span>
                            {data.role?.type && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-medium uppercase">
                                    {data.role?.type}
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                            Status
                        </span>
                        <span
                            className={
                                "inline-block capitalize px-2 py-0.5 rounded-full text-xs font-semibold border " +
                                badgeColor(data.status)
                            }
                        >
                            {data.status}
                        </span>
                    </div>
                    <UserInfoField title="Country" value={data.country?.name} />
                    <UserInfoField title="Gender" value={data.gender} />
                    {data.signUpDate && (
                        <UserInfoField
                            title="Sign Up Date"
                            value={dayjs(data.signUpDate).format('DD MMM YYYY')}
                        />
                    )}
                    {data.commissionAmount !== undefined &&
                        data.role?.type === 'SALES_AGENT' && (
                            <>
                                <UserInfoField
                                    title="Commission Amount"
                                    value={String(data.commissionAmount)}
                                />
                                <UserInfoField
                                    title="Monthly Sales Goal"
                                    value={String(data.monthlySalesGoal)}
                                />
                            </>
                        )}
                </div>
            </div>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete user"
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                onCancel={handleDialogClose}
                onConfirm={() => {
                    setDialogOpen(false)
                    router.push('/users/user-list')
                    toast.push(
                        <Notification title="Successfully Deleted" type="success">
                            User successfully deleted
                        </Notification>
                    )
                }}
            >
                <p className="text-sm text-gray-700">
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </Card>
    )
}

export default UserProfileSection
