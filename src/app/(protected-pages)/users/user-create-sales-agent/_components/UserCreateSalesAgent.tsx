'use client'

import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import UserForm from '@/components/view/UserForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { UserFormSchema } from '@/components/view/UserForm'
import { userService } from '@/services/user/userService'

const UserCreateSalesAgent = () => {
    const router = useRouter()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFormSubmit = async (values: UserFormSchema) => {
        setIsSubmitting(true)
        try {
            await userService.createSalesAgent({
                email: values.email,
                role: values.role,
                name: values.name,
                country: values.country,
                gender: values.gender,
                commissionAmount: values.commissionAmount || 0,
                monthlySalesGoal: values.monthlySalesGoal || 0,
            })
            toast.push(
                <Notification type="success">
                    Sales agent created successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            router.push('/users/user-list')
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to create sales agent. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        router.push('/users/user-list')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <UserForm
                newUser
                isSalesAgent
                defaultValues={{
                    name: '',
                    email: '',
                    role: '',
                    country: '',
                    gender: 'MALE',
                    commissionAmount: 10.5,
                    monthlySalesGoal: 5000,
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span />
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Create Sales Agent
                            </Button>
                        </div>
                    </div>
                </Container>
            </UserForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want to discard this? This action can&apos;t
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UserCreateSalesAgent
