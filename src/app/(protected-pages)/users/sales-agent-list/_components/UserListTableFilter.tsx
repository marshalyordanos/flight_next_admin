'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import { useUserListStore } from '../_store/userListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'

type FormSchema = {
    search: string
    orderBy: string
    orderDirection: string
    roleType?: string[]
}

const validationSchema: ZodType<FormSchema> = z.object({
    search: z.string(),
    orderBy: z.string(),
    orderDirection: z.string(),
    roleType: z.array(z.string()).optional().default([]),
})

const STATIC_ROLE_OPTIONS = [
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'SALES_AGENT', label: 'SALES_AGENT' },
    { value: 'SUPER_ADMIN', label: 'SUPER_ADMIN' },
    { value: 'SUB_ADMIN', label: 'SUB_ADMIN' },
    { value: 'USER', label: 'USER' },
]

const UserListTableFilter = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const filterData = useUserListStore((state) => state.filterData)
    const setFilterData = useUserListStore((state) => state.setFilterData)

    const { onAppendQueryParams } = useAppendQueryParams()

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const { handleSubmit, reset, control } = useForm<FormSchema>({
        defaultValues: {
            search: filterData.query || '',
            orderBy: filterData.orderBy || 'createdAt',
            orderDirection: filterData.orderDirection || 'asc',
            roleType: filterData.roleType || [],
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FormSchema) => {
        onAppendQueryParams({
            search: values.search,
            orderBy: values.orderBy,
            orderDirection: values.orderDirection,
            roleType: values.roleType && values.roleType.length > 0 ? values.roleType.join(',') : '',
            pageIndex: '1',
        })

        setFilterData({
            query: values.search,
            orderBy: values.orderBy,
            orderDirection: values.orderDirection,
            roleType: values.roleType,
        })
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => openDialog()}>
                Filter
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4 className="mb-4">Filter</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem label="Search">
                        <Controller
                            name="search"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Search by name or email"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Order By">
                        <Controller
                            name="orderBy"
                            control={control}
                            render={({ field }) => {
                                const orderByOptions = [
                                    { value: 'createdAt', label: 'Created Date' },
                                ]
                                return (
                                    <Select
                                        options={orderByOptions}
                                        value={orderByOptions.find(
                                            (o) => o.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )
                            }}
                        />
                    </FormItem>
                    <FormItem label="Order Direction">
                        <Controller
                            name="orderDirection"
                            control={control}
                            render={({ field }) => {
                                const orderDirOptions = [
                                    { value: 'asc', label: 'Ascending' },
                                    { value: 'desc', label: 'Descending' },
                                ]
                                return (
                                    <Select
                                        options={orderDirOptions}
                                        value={orderDirOptions.find(
                                            (o) => o.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )
                            }}
                        />
                    </FormItem>
                   
                    <div className="flex justify-end items-center gap-2 mt-4">
                        <Button type="button" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button type="submit" variant="solid">
                            Apply
                        </Button>
                    </div>
                </Form>
            </Dialog>
        </>
    )
}

export default UserListTableFilter
