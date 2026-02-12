'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, Form } from '@/components/ui/Form'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { roleService } from '@/services/role/roleService'
import type { RoleType, RolePermission } from '@/@types/role'
import { PiArrowLeft } from 'react-icons/pi'

const ROLE_TYPES: { value: RoleType; label: string }[] = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'SUB_ADMIN', label: 'Sub Admin' },
    { value: 'SALES_AGENT', label: 'Sales Agent' },
    { value: 'USER', label: 'User' },
]

const SUBJECTS = [
    'ALL',
    'AUTH',
    'API_KEY',
    'SETTING',
    'COUNTRY',
    'ROLE',
    'USER',
    'SESSION',
    'ACTIVITY',
]

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required') as z.ZodType<RoleType>,
})

type FormValues = z.infer<typeof schema>

const RoleCreatePage = () => {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [selectedPermissions, setSelectedPermissions] = useState<
        RolePermission[]
    >([{ subject: 'ALL', action: ['manage'] }])

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: { name: '', type: 'ADMIN' },
        resolver: zodResolver(schema),
    })

    const togglePermission = (subject: string) => {
        const exists = selectedPermissions.find((p) => p.subject === subject)
        if (exists) {
            if (subject === 'ALL') return
            setSelectedPermissions((prev) =>
                prev.filter((p) => p.subject !== subject),
            )
        } else {
            setSelectedPermissions((prev) => [
                ...prev,
                { subject, action: ['manage'] },
            ])
        }
    }

    const toggleAll = () => {
        if (selectedPermissions.some((p) => p.subject === 'ALL')) {
            setSelectedPermissions([])
        } else {
            setSelectedPermissions([{ subject: 'ALL', action: ['manage'] }])
        }
    }

    const onSubmit = async (values: FormValues) => {
        setSubmitting(true)
        try {
            await roleService.create({
                name: values.name,
                type: values.type,
                permissions: selectedPermissions,
            })
            router.push('/roles')
        } catch (err) {
            console.error('Create failed:', err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl">
            <Link
                href="/roles"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
            >
                <PiArrowLeft />
                Back to Roles
            </Link>
            <Card
                header={{
                    content: <h4 className="font-semibold">Create Role</h4>,
                }}
            >
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Name"
                        invalid={!!errors.name}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input placeholder="Role name" {...field} />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Type"
                        invalid={!!errors.type}
                        errorMessage={errors.type?.message}
                    >
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Select type"
                                    options={ROLE_TYPES}
                                    value={ROLE_TYPES.find(
                                        (o) => o.value === field.value,
                                    )}
                                    onChange={(opt) =>
                                        field.onChange(opt?.value ?? '')
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Permissions">
                        <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <Checkbox
                                checked={selectedPermissions.some(
                                    (p) => p.subject === 'ALL',
                                )}
                                onChange={() => toggleAll()}
                            >
                                <span className="font-medium">ALL (manage)</span>
                            </Checkbox>
                            {SUBJECTS.filter((s) => s !== 'ALL').map(
                                (subject) => (
                                    <div
                                        key={subject}
                                        className="pl-6"
                                    >
                                        <Checkbox
                                            checked={selectedPermissions.some(
                                                (p) => p.subject === subject,
                                            )}
                                            disabled={selectedPermissions.some(
                                                (p) => p.subject === 'ALL',
                                            )}
                                            onChange={() =>
                                                togglePermission(subject)
                                            }
                                        >
                                            {subject}
                                        </Checkbox>
                                    </div>
                                ),
                            )}
                        </div>
                    </FormItem>
                    <div className="flex gap-2 mt-6">
                        <Button
                            type="submit"
                            variant="solid"
                            loading={submitting}
                        >
                            Create Role
                        </Button>
                        <Link href="/roles">
                            <Button type="button" variant="plain">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default RoleCreatePage
