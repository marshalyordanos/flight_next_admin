'use client'

import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import UserForm from '@/components/view/UserForm'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { UserFormSchema } from '@/components/view/UserForm'
import type { User } from '@/app/(protected-pages)/users/user-list/types'
import { userService } from '@/services/user/userService'

type UserEditProps = {
    data: User
}

const UserEdit = ({ data }: UserEditProps) => {
    const router = useRouter()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const getDefaultValues = (): Partial<UserFormSchema> => {
        if (data) {
            return {
                name: data.name,
                email: data.email,
                role: data.role?._id || '',
                country: data.country?._id || '',
                gender: (data.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
                commissionAmount: data.commissionAmount,
                monthlySalesGoal: data.monthlySalesGoal,
            }
        }
        return {}
    }

    const handleFormSubmit = async (values: UserFormSchema) => {
        setIsSubmitting(true)
        try {
            const isSalesAgent = data.role?.type === 'SALES_AGENT'
            if (isSalesAgent) {
                await userService.updateSalesAgent(data._id, {
                    email: values.email,
                    role: values.role,
                    name: values.name,
                    country: values.country,
                    gender: values.gender,
                    commissionAmount: values.commissionAmount || 0,
                    monthlySalesGoal: values.monthlySalesGoal || 0,
                })
            } else {
                await userService.update(data._id, {
                    role: values.role,
                    name: values.name,
                    country: values.country,
                    gender: values.gender,
                })
            }
            toast.push(
                <Notification type="success">Changes saved!</Notification>,
                { placement: 'top-center' },
            )
            router.push('/users/user-list')
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to update user. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        history.back()
    }

    const isSalesAgent = data.role?.type === 'SALES_AGENT'

    return (
        <>
            <UserForm
                defaultValues={getDefaultValues()}
                newUser={false}
                isSalesAgent={isSalesAgent}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <Button
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </Container>
            </UserForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove user"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={() => {
                    setDeleteConfirmationOpen(false)
                    toast.push(
                        <Notification type="success">User deleted!</Notification>,
                        { placement: 'top-center' },
                    )
                    router.push('/users/user-list')
                }}
            >
                <p>
                    Are you sure you want to remove this user? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UserEdit
