'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/Form'
import FormItem from '@/components/ui/Form/FormItem'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useMemo } from 'react'
import useSWR from 'swr'
import { roleService } from '@/services/role/roleService'

export const userFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    role: z.string().min(1, 'Role is required'),
    country: z.string().min(1, 'Country is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    commissionAmount: z.number().optional(),
    monthlySalesGoal: z.number().optional(),
})

export type UserFormSchema = z.infer<typeof userFormSchema>

type UserFormProps = {
    defaultValues?: Partial<UserFormSchema>
    newUser?: boolean
    isSalesAgent?: boolean
    children?: React.ReactNode
    onFormSubmit?: (values: UserFormSchema) => void
}

const GENDER_OPTIONS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
]

const UserForm = ({
    defaultValues,
    newUser = true,
    isSalesAgent = false,
    children,
    onFormSubmit,
}: UserFormProps) => {
    const { data: rolesData } = useSWR(
        'roles-list',
        () => roleService.getList({ perPage: 100 }),
    )

    const roleOptions = useMemo(() => {
        if (!rolesData) return []
        const data = (rolesData as { data?: { _id: string; name: string }[] })
            ?.data
        const roles = Array.isArray(data) ? data : []
        return roles.map((role) => ({
            value: role._id,
            label: role.name,
        }))
    }, [rolesData])

    const methods = useForm<UserFormSchema>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: '',
            email: '',
            role: '',
            country: '',
            gender: 'MALE',
            commissionAmount: undefined,
            monthlySalesGoal: undefined,
            ...defaultValues,
        },
    })

    const { handleSubmit, register } = methods

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleSubmit((values) => onFormSubmit?.(values))}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem label="Name">
                        <Input {...register('name')} placeholder="Full name" />
                    </FormItem>
                    <FormItem label="Email">
                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="Email"
                            disabled={!newUser && !isSalesAgent}
                        />
                    </FormItem>
                    <FormItem label="Role">
                        <Select
                            options={roleOptions}
                            value={roleOptions.find(
                                (o) => o.value === methods.watch('role'),
                            )}
                            onChange={(option) =>
                                methods.setValue('role', option?.value || '')
                            }
                            placeholder="Select role"
                        />
                    </FormItem>
                    <FormItem label="Country ID">
                        <Input
                            {...register('country')}
                            placeholder="Country ID (e.g. b9b12484-4004-428f-83b6-6c02cf958144)"
                        />
                    </FormItem>
                    <FormItem label="Gender">
                        <Select
                            options={GENDER_OPTIONS}
                            value={GENDER_OPTIONS.find(
                                (o) => o.value === methods.watch('gender'),
                            )}
                            onChange={(option) =>
                                methods.setValue(
                                    'gender',
                                    (option?.value as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
                                )
                            }
                        />
                    </FormItem>
                    {isSalesAgent && (
                        <>
                            <FormItem label="Commission Amount">
                                <Input
                                    {...register('commissionAmount', {
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    placeholder="10.5"
                                />
                            </FormItem>
                            <FormItem label="Monthly Sales Goal">
                                <Input
                                    {...register('monthlySalesGoal', {
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    placeholder="5000"
                                />
                            </FormItem>
                        </>
                    )}
                </div>
                {children}
            </Form>
        </FormProvider>
    )
}

export default UserForm
