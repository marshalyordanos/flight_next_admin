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
import { HiCheckCircle, HiMail, HiUser, HiHashtag, HiGlobe, HiIdentification, HiUserGroup } from 'react-icons/hi'
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

// Custom simple tag for demo. Could use a ui library.
const Tag = ({ color = "blue", icon, children }: { color?: string, icon?: React.ReactNode, children: React.ReactNode }) => (
    <span className={`inline-flex items-center gap-1 px-3 py-[2px] rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700 border border-${color}-200`}>
        {icon}
        {children}
    </span>
)

type ProfileContentProps = {
    initialData?: User | null
}

const ProfileContent = ({ initialData = null }: ProfileContentProps) => {
    const [profileData, setProfileData] = useState<User | null>(initialData)
    const [loading, setLoading] = useState(!initialData)

    useEffect(() => {
        if (!initialData) {
            setLoading(true)
            userService
                .getProfile()
                .then((res) => setProfileData(res.data))
                .catch(() => setProfileData(null))
                .finally(() => setLoading(false))
        }
    }, [initialData])
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <p className="text-gray-500 mt-4">Loading profile...</p>
            </div>
        )
    }

    if (!profileData) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <p className="text-gray-500">Unable to load profile.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 mx-auto ">
            <Card className="w-full shadow-lg border border-slate-300">
                <div className="flex justify-between items-center mb-6 border-b border-b-slate-200 pb-4">
                    <div className="flex items-center gap-4">
                        <Avatar size={90} shape="circle" />
                        <div>
                            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                                {profileData.name}
                                <Tag color="emerald" icon={<HiCheckCircle className="text-emerald-600" />}>Verified</Tag>
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Tag icon={<HiUserGroup className="text-blue-500" />}>
                                    {profileData.role?.name || "User"}
                                </Tag>
                                <Tag color="purple" icon={<HiIdentification className="text-purple-500" />}>
                                    {profileData.username}
                                </Tag>
                            </div>
                        </div>
                    </div>
                    <div>
                        {!isEditing ? (
                            <Button
                                size="sm"
                                icon={<HiPencil />}
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Edit Profile
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
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row items-center gap-10 px-2 pb-6">
                    {/* Form or Info Box */}
                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                </div>
                            </Form>
                        ) : (
                            <div className="w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="p-4 flex items-center rounded-lg border border-slate-200 bg-gray-50 gap-4">
                                        <span className="bg-blue-100 text-blue-700 rounded-full p-2"><HiUser className="w-5 h-5" /></span>
                                        <div>
                                            <div className="text-xs text-gray-500">Name</div>
                                            <div className="font-semibold">{profileData.name}</div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center rounded-lg border border-emerald-200 bg-gray-50 gap-4">
                                        <span className="bg-emerald-100 text-emerald-700 rounded-full p-2"><HiMail className="w-5 h-5" /></span>
                                        <div>
                                            <div className="text-xs text-gray-500">Email</div>
                                            <div className="font-semibold">{profileData.email}</div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center rounded-lg border border-purple-200 bg-gray-50 gap-4">
                                        <span className="bg-purple-100 text-purple-700 rounded-full p-2"><HiIdentification className="w-5 h-5" /></span>
                                        <div>
                                            <div className="text-xs text-gray-500">Username</div>
                                            <div className="font-semibold">{profileData.username}</div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center rounded-lg border border-yellow-200 bg-gray-50 gap-4">
                                        <span className="bg-yellow-100 text-yellow-700 rounded-full p-2"><HiUserGroup className="w-5 h-5" /></span>
                                        <div>
                                            <div className="text-xs text-gray-500">Role</div>
                                            <div className="font-semibold">{profileData.role?.name}</div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center rounded-lg border border-indigo-200 bg-gray-50 gap-4">
                                        <span className="bg-indigo-100 text-indigo-700 rounded-full p-2"><HiGlobe className="w-5 h-5" /></span>
                                        <div>
                                            <div className="text-xs text-gray-500">Country</div>
                                            <div className="font-semibold">{profileData.country?.name}</div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center rounded-lg border border-pink-200 bg-gray-50 gap-4">
                                        <span className="bg-pink-100 text-pink-700 rounded-full p-2"><HiHashtag className="w-5 h-5" /></span>
                                        <div>
                                            <div className="text-xs text-gray-500">Gender</div>
                                            <div className="font-semibold">{profileData.gender}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ProfileContent
