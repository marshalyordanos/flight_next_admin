'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HiPencil } from 'react-icons/hi'
import { userService } from '@/services/user/userService'
import type { User } from '@/app/(protected-pages)/users/user-list/types'

const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    country: z.string().min(1, 'Country is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
})

type ProfileFormSchema = z.infer<typeof profileSchema>

const GENDER_OPTIONS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
]

type ProfileContentProps = {
    initialData: User | null
}

const ProfileContent = ({ initialData }: ProfileContentProps) => {
    const [profileData, setProfileData] = useState<User | null>(initialData)
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData?.name || '',
            country: initialData?.country?._id || '',
            gender: (initialData?.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
        },
    })

    useEffect(() => {
        if (profileData) {
            reset({
                name: profileData.name,
                country: profileData.country?._id || '',
                gender: (profileData.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
            })
        }
    }, [profileData, reset])

    const onSubmit = async (values: ProfileFormSchema) => {
        setIsSubmitting(true)
        try {
            await userService.updateProfile({
                name: values.name,
                country: values.country,
                gender: values.gender,
            })
            toast.push(
                <Notification type="success">
                    Profile updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            setIsEditing(false)
            const res = await userService.getProfile()
            setProfileData(res.data)
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to update profile. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!profileData) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <p className="text-gray-500">Unable to load profile.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <h3 className="font-bold">Profile</h3>
            <Card className="w-full">
                <div className="flex justify-end mb-4">
                    {!isEditing ? (
                        <Button
                            size="sm"
                            icon={<HiPencil />}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="plain"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                variant="solid"
                                loading={isSubmitting}
                                disabled={!isDirty}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col xl:flex-row items-center gap-6">
                    <Avatar size={90} shape="circle" />
                    <div className="flex-1 w-full space-y-2">
                        {isEditing ? (
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <FormItem label="Name">
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Full name"
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Country ID">
                                    <Controller
                                        name="country"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Country ID"
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Gender">
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={GENDER_OPTIONS}
                                                value={GENDER_OPTIONS.find(
                                                    (o) => o.value === field.value,
                                                )}
                                                onChange={(option) =>
                                                    field.onChange(
                                                        option?.value || 'MALE',
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </Form>
                        ) : (
                            <>
                                <div>
                                    <span className="font-semibold">Name: </span>
                                    <span>{profileData.name}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Email:{' '}
                                    </span>
                                    <span>{profileData.email}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Username:{' '}
                                    </span>
                                    <span>{profileData.username}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Role:{' '}
                                    </span>
                                    <span>{profileData.role?.name}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Country:{' '}
                                    </span>
                                    <span>{profileData.country?.name}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Gender:{' '}
                                    </span>
                                    <span>{profileData.gender}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ProfileContent
