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

const UserInfoField = ({ title, value }: UserInfoFieldProps) => {
    return (
        <div>
            <span className="font-semibold">{title}</span>
            <p className="heading-text font-bold">{value || '-'}</p>
        </div>
    )
}

type UserProfileSectionProps = {
    data: User
}

const UserProfileSection = ({ data }: UserProfileSectionProps) => {
    const router = useRouter()
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDialogClose = () => {
        setDialogOpen(false)
    }

    const handleEdit = () => {
        router.push(`/users/user-edit/${data._id}`)
    }

    return (
        <Card className="w-full">
            <div className="flex justify-end">
                <Tooltip title="Edit user">
                    <button
                        className="close-button button-press-feedback"
                        type="button"
                        onClick={handleEdit}
                    >
                        <HiPencil />
                    </button>
                </Tooltip>
            </div>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="flex xl:flex-col items-center gap-4 mt-6">
                    <Avatar size={90} shape="circle" />
                    <h4 className="font-bold">{data.name}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
                    <UserInfoField title="Email" value={data.email} />
                    <UserInfoField title="Username" value={data.username} />
                    <UserInfoField
                        title="Role"
                        value={data.role?.name}
                    />
                    <UserInfoField
                        title="Status"
                        value={data.status}
                    />
                    <UserInfoField
                        title="Country"
                        value={data.country?.name}
                    />
                    <UserInfoField
                        title="Gender"
                        value={data.gender}
                    />
                    {data.signUpDate && (
                        <UserInfoField
                            title="Sign Up Date"
                            value={dayjs(data.signUpDate).format(
                                'DD MMM YYYY',
                            )}
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
                        </Notification>,
                    )
                }}
            >
                <p>
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </Card>
    )
}

export default UserProfileSection
