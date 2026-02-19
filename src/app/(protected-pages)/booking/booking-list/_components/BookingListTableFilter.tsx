import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'

const PAYMENT_STATUS_OPTIONS = [
    { value: 'PAID', label: 'PAID' },
    { value: 'PENDING', label: 'PENDING' },
    { value: 'CANCELED', label: 'CANCELED' },
    { value: 'REFUNDED', label: 'REFUNDED' },
    { value: 'EXPIRED', label: 'EXPIRED' },
]

const BookingListTableFilter = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    const { onAppendQueryParams } = useAppendQueryParams()
    // const setBookingList = useBookingListStore((state) => state.setBookingList)

    const openDialog = () => setIsOpen(true)
    const onDialogClose = () => setIsOpen(false)

    const { handleSubmit, reset, control } = useForm({
        defaultValues: {
            paymentStatus: '',
            orderBy: 'createdAt',
            orderDirection: '',
        },
    })

    interface FilterForm {
        paymentStatus: string
        orderBy: string
        orderDirection: string
    }
    const onSubmit = (values: FilterForm) => {
        onAppendQueryParams({
            paymentStatus: values.paymentStatus,
            orderBy: values.orderBy,
            orderDirection: values.orderDirection,
            page: '1',
        })
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={openDialog}>
                Filter
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4 className="mb-4">Filter</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem label="Payment Status">
                        <Controller
                            name="paymentStatus"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={PAYMENT_STATUS_OPTIONS}
                                    value={
                                        PAYMENT_STATUS_OPTIONS.find(
                                            (o) => o.value === field.value,
                                        ) || null
                                    }
                                    onChange={(option) =>
                                        field.onChange(option?.value || '')
                                    }
                                    isClearable
                                    placeholder="Select status"
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Order By">
                        <Controller
                            name="orderBy"
                            control={control}
                            render={() => (
                                <Select
                                    options={[
                                        {
                                            value: 'createdAt',
                                            label: 'Created Date',
                                        },
                                    ]}
                                    value={{
                                        value: 'createdAt',
                                        label: 'Created Date',
                                    }}
                                    isDisabled
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Order Direction">
                        <Controller
                            name="orderDirection"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={[
                                        { value: '', label: 'Default' },
                                        { value: 'asc', label: 'Ascending' },
                                        { value: 'desc', label: 'Descending' },
                                    ]}
                                    value={[
                                        { value: '', label: 'Default' },
                                        { value: 'asc', label: 'Ascending' },
                                        { value: 'desc', label: 'Descending' },
                                    ].find((o) => o.value === field.value)}
                                    onChange={(option) =>
                                        field.onChange(option?.value || '')
                                    }
                                />
                            )}
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

export default BookingListTableFilter
