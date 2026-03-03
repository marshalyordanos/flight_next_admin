'use client'

import { useState, useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Tabs from '@/components/ui/Tabs'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { configurationService } from '@/services/configuration/configurationService'
import { HiCurrencyDollar, HiReceiptTax, HiTrendingUp, HiPencilAlt, HiTrash } from 'react-icons/hi'
import DataTable from '@/components/shared/DataTable'
import Modal from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'

const { TabNav, TabList, TabContent } = Tabs

// --- Interfaces ---

type RateCardProps = {
    title: string
    description: string
    icon: React.ReactNode
    value: number | null
    loading: boolean
    onSave: (value: number) => Promise<void>
}

type AirlineClassMarkup = {
    id: string
    airlineCode: string
    airlineName: string
    economy: number
    premiumEconomy: number
    business: number
    first: number
}

// --- Mock Data ---

const mockAirlinesList = [
    { code: 'ET', name: 'Ethiopian Airlines' },
    { code: 'EK', name: 'Emirates' },
    { code: 'QR', name: 'Qatar Airways' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'AF', name: 'Air France' },
    { code: 'BA', name: 'British Airways' },
    { code: 'KL', name: 'KLM' },
    { code: 'TK', name: 'Turkish Airlines' },
    { code: 'UA', name: 'United Airlines' },
    { code: 'DL', name: 'Delta Air Lines' },
    { code: 'AA', name: 'American Airlines' },
    { code: 'QH', name: 'Bamboo Airways' },
    { code: 'FJ', name: 'Fiji Airways' },
    { code: 'AC', name: 'Air Canada' },
    { code: 'CX', name: 'Cathay Pacific' },
    { code: 'SQ', name: 'Singapore Airlines' },
    { code: 'NH', name: 'ANA' }
]

// --- Helper ---

function getAirlineOptionList(existingCodes?: string[]) {
    return mockAirlinesList.map((air) => ({
        label: `${air.name} (${air.code})`,
        value: air.code,
        disabled: existingCodes ? existingCodes.includes(air.code) : false,
    }))
}

// --- RateCard component ---

const RateCard = ({
    title,
    description,
    icon,
    value,
    loading,
    onSave,
}: RateCardProps) => {
    const [inputValue, setInputValue] = useState(
        value !== null ? String(value) : '',
    )
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (value !== null) {
            setInputValue(String(value))
        }
    }, [value])

    const handleSave = async () => {
        const num = parseFloat(inputValue)
        if (isNaN(num) || num < 0) {
            toast.push(
                <Notification type="danger">
                    Please enter a valid number (0 or greater).
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        setSaving(true)
        try {
            await onSave(num)
            toast.push(
                <Notification type="success">Saved successfully!</Notification>,
                { placement: 'top-center' },
            )
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to save. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <Card
            className="overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200"
            bodyClass="p-0"
        >
            <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl text-primary">{icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {description}
                        </p>

                        {loading ? (
                            <div className="h-12 flex items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 max-w-xs">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={inputValue}
                                        onChange={(e) =>
                                            setInputValue(e.target.value)
                                        }
                                        placeholder="Enter rate (e.g. 12.5)"
                                        className="text-lg font-semibold"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Value in percentage (%)
                                    </p>
                                </div>
                                <Button
                                    variant="solid"
                                    onClick={handleSave}
                                    loading={saving}
                                    disabled={saving}
                                    className="self-start"
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

// --- Add/Edit Airline Markup Modal ---

const AddEditAirlineMarkupModal = ({
    visible,
    onClose,
    onAdd,
    onEdit,
    airlinesOptions,
    editData,
}: {
    visible: boolean
    onClose: () => void
    onAdd?: (payload: Omit<AirlineClassMarkup, 'id'>) => void
    onEdit?: (payload: AirlineClassMarkup) => void
    airlinesOptions: { label: string, value: string, disabled?: boolean }[]
    editData?: AirlineClassMarkup | null
}) => {
    const [selectedAirline, setSelectedAirline] = useState<string | null>(null)
    const [economy, setEconomy] = useState('')
    const [premiumEconomy, setPremiumEconomy] = useState('')
    const [business, setBusiness] = useState('')
    const [first, setFirst] = useState('')

    // For adding new airlines
    const [isCustomAirline, setIsCustomAirline] = useState(false)
    const [customAirlineName, setCustomAirlineName] = useState('')
    const [customAirlineCode, setCustomAirlineCode] = useState('')

    useEffect(() => {
        if (editData) {
            setSelectedAirline(editData.airlineCode)
            setEconomy(String(editData.economy))
            setPremiumEconomy(String(editData.premiumEconomy))
            setBusiness(String(editData.business))
            setFirst(String(editData.first))
            setIsCustomAirline(false)
            setCustomAirlineName('')
            setCustomAirlineCode('')
        } else {
            setSelectedAirline(null)
            setEconomy('')
            setPremiumEconomy('')
            setBusiness('')
            setFirst('')
            setIsCustomAirline(false)
            setCustomAirlineName('')
            setCustomAirlineCode('')
        }
    }, [visible, editData])

    const availableStandardAirlines = airlinesOptions.filter(
        (option) => !option.disabled || option.value === selectedAirline
    );

    const hasAvailableStandardAirlines = availableStandardAirlines.length > 0;

    // Suppress TypeScript error for now; see file_context_0 about explicit any/eslint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const handleAirlineChange = (newValue: any, actionMeta?: any) => {
        const value = newValue && typeof newValue === "object" ? newValue.value : newValue
        if (value === '__custom__') {
            setIsCustomAirline(true)
            setSelectedAirline(null)
        } else {
            setIsCustomAirline(false)
            setSelectedAirline(value)
        }
    }

    const isEdit = !!editData;

    const handleSave = () => {
        let airlineName = ''
        let airlineCode = ''

        if (!isEdit && isCustomAirline) {
            if (!customAirlineName || !customAirlineCode) {
                toast.push(
                    <Notification type="danger">
                        Please enter airline name and code.
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }
            airlineName = customAirlineName.trim()
            airlineCode = customAirlineCode.trim().toUpperCase()
        } else if (!isEdit && selectedAirline) {
            const found = airlinesOptions.find(
                option => option.value === selectedAirline
            );
            if (!found || found.disabled) {
                toast.push(
                    <Notification type="danger">
                        This airline is already in the markup list. You can&apos;t add it again.
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }
            const mockAirline = mockAirlinesList.find(a => a.code === selectedAirline)
            airlineName = mockAirline ? mockAirline.name : ''
            airlineCode = mockAirline ? mockAirline.code : ''
            if (!airlineName || !airlineCode) {
                toast.push(
                    <Notification type="danger">
                        Please select an airline.
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }
        } else if (isEdit) {
            airlineName = editData!.airlineName
            airlineCode = editData!.airlineCode
        } else {
            toast.push(
                <Notification type="danger">
                    Please select an airline.
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        if (
            [economy, premiumEconomy, business, first].some(
                v => v === '' || isNaN(Number(v)) || Number(v) < 0
            )
        ) {
            toast.push(
                <Notification type="danger">
                    Please enter valid markup (0 or greater) for all classes.
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        if (isEdit && onEdit) {
            onEdit({
                ...editData!,
                economy: Number(economy),
                premiumEconomy: Number(premiumEconomy),
                business: Number(business),
                first: Number(first),
            })
        } else if (!isEdit && onAdd) {
            onAdd({
                airlineCode,
                airlineName,
                economy: Number(economy),
                premiumEconomy: Number(premiumEconomy),
                business: Number(business),
                first: Number(first),
            })
        }
        onClose()
    }

    return (
        <Modal  isOpen={visible} onClose={onClose}>
            <div className="space-y-4 px-2 py-1">
                {!isEdit && (
                    <div>
                        <label className="font-medium text-gray-700 dark:text-gray-200 block mb-1">
                            Airline
                        </label>
                        <Select
                            value={
                                isCustomAirline
                                    ? { label: 'Other Airline...', value: '__custom__' }
                                    : availableStandardAirlines.find(option => option.value === selectedAirline) || ''
                            }
                            onChange={handleAirlineChange}
                            options={[
                                ...availableStandardAirlines,
                                { label: 'Other Airline...', value: '__custom__' }
                            ]}
                            placeholder={!hasAvailableStandardAirlines
                                ? 'No available airline to add'
                                : 'Select airline'}
                            className="w-full"
                            isDisabled={!hasAvailableStandardAirlines && !isCustomAirline}
                        />
                        {!hasAvailableStandardAirlines && !isCustomAirline && (
                            <div className="text-xs mt-1 text-yellow-500">
                                All airlines have already been added. To add another, select &quot;Other Airline...&quot;.
                            </div>
                        )}
                    </div>
                )}

                {!isEdit && isCustomAirline && (
                    <>
                        <div>
                            <label className="font-medium text-gray-700 dark:text-gray-200 block mb-1">
                                Airline Name
                            </label>
                            <Input
                                value={customAirlineName}
                                onChange={e => setCustomAirlineName(e.target.value)}
                                placeholder="E.g. Bamboo Airways"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="font-medium text-gray-700 dark:text-gray-200 block mb-1">
                                Airline Code
                            </label>
                            <Input
                                value={customAirlineCode}
                                onChange={e => setCustomAirlineCode(e.target.value)}
                                placeholder="E.g. QH"
                                className="w-full"
                                maxLength={3}
                            />
                        </div>
                    </>
                )}

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div>
                        <label className="text-sm block text-gray-600 dark:text-gray-300 mb-1">
                            Economy Class (USD)
                        </label>
                        <Input
                            type="number"
                            value={economy}
                            onChange={e => setEconomy(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="text-sm block text-gray-600 dark:text-gray-300 mb-1">
                            Premium Economy (USD)
                        </label>
                        <Input
                            type="number"
                            value={premiumEconomy}
                            onChange={e => setPremiumEconomy(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="text-sm block text-gray-600 dark:text-gray-300 mb-1">
                            Business Class (USD)
                        </label>
                        <Input
                            type="number"
                            value={business}
                            onChange={e => setBusiness(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="text-sm block text-gray-600 dark:text-gray-300 mb-1">
                            First Class (USD)
                        </label>
                        <Input
                            type="number"
                            value={first}
                            onChange={e => setFirst(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-2 justify-end">
                    <Button variant="plain" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleSave}
                        disabled={!isEdit && !isCustomAirline && !hasAvailableStandardAirlines}
                    >
                        {isEdit ? 'Save' : 'Add'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

// --- Tab Airline Markup Table ---

const initialAirlineMarkups: AirlineClassMarkup[] = [
    {
        id: '1',
        airlineCode: 'ET',
        airlineName: 'Ethiopian Airlines',
        economy: 12,
        premiumEconomy: 15,
        business: 20,
        first: 25,
    },
    {
        id: '2',
        airlineCode: 'EK',
        airlineName: 'Emirates',
        economy: 10,
        premiumEconomy: 12,
        business: 22,
        first: 23,
    },
    {
        id: '3',
        airlineCode: 'QR',
        airlineName: 'Qatar Airways',
        economy: 11,
        premiumEconomy: 14,
        business: 21,
        first: 22,
    },
    {
        id: '5',
        airlineCode: 'AF',
        airlineName: 'Air France',
        economy: 9,
        premiumEconomy: 13,
        business: 19,
        first: 22,
    },
    {
        id: '6',
        airlineCode: 'BA',
        airlineName: 'British Airways',
        economy: 10,
        premiumEconomy: 13,
        business: 18,
        first: 20,
    },
    // The rest are intentionally left for adding only!
]

// --- Table columns (referenced UserListTable style) ---

const airlineColumns: ColumnDef<AirlineClassMarkup>[] = [
    {
        header: 'Airline',
        accessorKey: 'airlineName',
        cell: props => {
            const row = props.row.original
            return (
                <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{row.airlineName}</span>
                    <span className="text-xs block text-gray-500 dark:text-gray-400">{row.airlineCode}</span>
                </div>
            )
        }
    },
    {
        header: 'Economy (USD)',
        accessorKey: 'economy',
        cell: props => <span>{props.row.original.economy.toFixed(2)}</span>
    },
    {
        header: 'Premium Economy (USD)',
        accessorKey: 'premiumEconomy',
        cell: props => <span>{props.row.original.premiumEconomy.toFixed(2)}</span>
    },
    {
        header: 'Business (USD)',
        accessorKey: 'business',
        cell: props => <span>{props.row.original.business.toFixed(2)}</span>
    },
    {
        header: 'First (USD)',
        accessorKey: 'first',
        cell: props => <span>{props.row.original.first.toFixed(2)}</span>
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: props => {
            const row = props.row.original
            return (
                <div className="flex gap-2">
                    <Button
                        variant="plain"
                        size="sm"
                        icon={<HiPencilAlt />}
                        onClick={() => {
                            setEditModalOpenFn?.(true)
                            setEditDataFn?.(row)
                        }}

                    />
                    <Button
                        variant="plain"
                        size="sm"
                        icon={<HiTrash />}
                        onClick={() => {
                            if (
                                typeof window !== "undefined" &&
                                window.confirm(
                                    `Delete markup rate for ${row.airlineName}?`
                                )
                            ) {
                                handleDeleteFn?.(row)
                            }
                        }}
                    />
                </div>
            )
        }
    }
]

// --- Airline Markup Table Section ---

// These are hoisted state set functions to be assigned per-render for airlineColumns
let setEditModalOpenFn: React.Dispatch<React.SetStateAction<boolean>> | null = null
let setEditDataFn: React.Dispatch<React.SetStateAction<AirlineClassMarkup | null>> | null = null
let handleDeleteFn: ((row: AirlineClassMarkup) => void) | null = null

const AirlineMarkupTableSection = ({
    airlineMarkups,
    setAirlineMarkups,
}: {
    airlineMarkups: AirlineClassMarkup[],
    setAirlineMarkups: React.Dispatch<React.SetStateAction<AirlineClassMarkup[]>>
}) => {
    const [search, setSearch] = useState('')
    const [selectedAirline] = useState<string>('')

    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editData, setEditData] = useState<AirlineClassMarkup | null>(null)

    // Assign handlers for airlineColumns action buttons so inner scope functions can access these setFns
    setEditModalOpenFn = setEditModalOpen
    setEditDataFn = setEditData

    // Pass handleDelete with closure
    const handleDelete = (row: AirlineClassMarkup) => {
        setAirlineMarkups(current =>
            current.filter((item) => item.id !== row.id)
        )
        toast.push(
            <Notification type="success">
                Airline markup rate deleted!
            </Notification>,
            { placement: 'top-center' }
        )
    }
    handleDeleteFn = handleDelete

    // Pagination
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [sort, setSort] = useState<{ key: string, order: 'asc' | 'desc' | undefined }>({ key: '', order: undefined })

    // Search and filter
    const filteredData = useMemo(() => {
        let filtered = airlineMarkups
        if (search.trim()) {
            filtered = filtered.filter(
                d =>
                    d.airlineName.toLowerCase().includes(search.trim().toLowerCase()) ||
                    d.airlineCode.toLowerCase().includes(search.trim().toLowerCase())
            )
        }
        if (selectedAirline && selectedAirline !== '__all__') {
            filtered = filtered.filter(d => d.airlineCode === selectedAirline)
        }
        // sort if needed
        if (sort.key) {
            filtered = [...filtered].sort((a, b) => {
                let va = (a as Record<string, string | number>)[sort.key],
                    vb = (b as Record<string, string | number>)[sort.key]
                if (typeof va === 'string') va = va.toLowerCase()
                if (typeof vb === 'string') vb = vb.toLowerCase()
                if (va < vb) return sort.order === 'asc' ? -1 : 1
                if (va > vb) return sort.order === 'asc' ? 1 : -1
                return 0
            })
        }
        return filtered
    }, [airlineMarkups, search, selectedAirline, sort])

    // Paginated Data
    const pagedData = useMemo(() => {
        const first = (pageIndex - 1) * pageSize
        return filteredData.slice(first, first + pageSize)
    }, [filteredData, pageIndex, pageSize])

    // get disabled airline codes for select
    const existingCodes = airlineMarkups.map(x => x.airlineCode)

    const handleAdd = (payload: Omit<AirlineClassMarkup, 'id'>) => {
        setAirlineMarkups(current => [
            ...current,
            {
                ...payload,
                id: (Math.random() * 100000).toFixed(0)
            }
        ])
        toast.push(
            <Notification type="success">
                Airline markup rate added!
            </Notification>,
            { placement: 'top-center' }
        )
    }

    const handleEdit = (updatedRow: AirlineClassMarkup) => {
        setAirlineMarkups(curr =>
            curr.map(row =>
                row.id === updatedRow.id ? { ...updatedRow } : row
            )
        )
        toast.push(
            <Notification type="success">
                Airline markup rate updated!
            </Notification>,
            { placement: 'top-center' }
        )
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPageIndex(1)
    }
    // const handleFilterAirline = (v: string) => {
    //     setSelectedAirline(v)
    //     setPageIndex(1)
    // }
    const handlePageChange = (page: number) => setPageIndex(page)
    const handlePageSizeChange = (size: number) => {
        setPageIndex(1)
        setPageSize(size)
    }
    const handleSort = (s: OnSortParam) => setSort({ key: String(s.key), order: s.order as 'asc' | 'desc' | undefined })

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-row gap-2">
                    <Input
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by airline name or code"
                        className="w-94"
                    />
                    {/* <Select
                        value={selectedAirline}
                        onChange={handleFilterAirline}
                        options={[
                            { value: '__all__', label: 'All Airlines' },
                            ...getAirlineOptionList()
                        ]}
                        className="w-40"
                    /> */}
                </div>
                <Button
                    variant="solid"
                    onClick={() => setModalOpen(true)}
                    icon={<HiTrendingUp />}
                >
                    Add Airline Markup
                </Button>
            </div>
            <DataTable
                columns={airlineColumns}
                data={pagedData}
                pagingData={{
                    total: filteredData.length,
                    pageIndex,
                    pageSize,
                }}
                // pageSizeOptions={[5, 10, 20, 50]}
                onPaginationChange={handlePageChange}
                onSelectChange={handlePageSizeChange}
                onSort={handleSort}
                loading={false}
                noData={filteredData.length === 0}
            />
            <AddEditAirlineMarkupModal
                visible={modalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAdd}
                airlinesOptions={getAirlineOptionList(existingCodes)}
            />
            <AddEditAirlineMarkupModal
                visible={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setEditData(null)
                }}
                onEdit={handleEdit}
                editData={editData}
                airlinesOptions={[]} // No airline changing during edit
            />
        </div>
    )
}

// --- Main ConfigurationContent ---

const ConfigurationContent = () => {
    const [activeTab, setActiveTab] = useState('airline-markup')
    const [markupValue, setMarkupValue] = useState<number | null>(null)
    const [taxValue, setTaxValue] = useState<number | null>(null)
    const [markupLoading, setMarkupLoading] = useState(true)
    const [taxLoading, setTaxLoading] = useState(true)

    // state for airline markup table
    const [airlineMarkups, setAirlineMarkups] = useState<AirlineClassMarkup[]>(initialAirlineMarkups)

    const fetchMarkupRate = () => {
        setMarkupLoading(true)
        configurationService
            .getMarkupRate()
            .then((res) => setMarkupValue(res.data.value))
            .catch(() => setMarkupValue(null))
            .finally(() => setMarkupLoading(false))
    }

    const fetchTaxRate = () => {
        setTaxLoading(true)
        configurationService
            .getTaxRate()
            .then((res) => setTaxValue(res.data.value))
            .catch(() => setTaxValue(null))
            .finally(() => setTaxLoading(false))
    }

    useEffect(() => {
        if (activeTab === 'markup') {
            fetchMarkupRate()
        } else if (activeTab === 'tax') {
            fetchTaxRate()
        }
    }, [activeTab])

    const handleSaveMarkup = async (value: number) => {
        await configurationService.createOrUpdateMarkupRate(value)
        setMarkupValue(value)
    }

    const handleSaveTax = async (value: number) => {
        await configurationService.createOrUpdateTaxRate(value)
        setTaxValue(value)
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Manage markup rate and tax rate settings
                </p>
            </div>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <TabList className="mb-6">
                    <TabNav value="airline-markup">
                        <HiTrendingUp className="text-lg mr-2" />
                        Airline Markup
                    </TabNav>
                    <TabNav value="markup">
                        <HiCurrencyDollar className="text-lg mr-2" />
                        Markup Rate
                    </TabNav>
                    <TabNav value="tax">
                        <HiReceiptTax className="text-lg mr-2" />
                        Tax Rate
                    </TabNav>
                </TabList>

                <TabContent value="markup">
                    <div className="flex flex-col gap-8">
                        <RateCard
                            title="Markup Rate"
                            description="Set the default markup percentage applied to products. This rate will be used when calculating selling prices."
                            icon={<HiCurrencyDollar />}
                            value={markupValue}
                            loading={markupLoading}
                            onSave={handleSaveMarkup}
                        />
                    </div>
                </TabContent>

                <TabContent value="tax">
                    <RateCard
                        title="Tax Rate"
                        description="Set the tax percentage applied to transactions. This rate will be used when calculating tax amounts."
                        icon={<HiReceiptTax />}
                        value={taxValue}
                        loading={taxLoading}
                        onSave={handleSaveTax}
                    />
                </TabContent>

                {/* Airline Markup Management Tab */}
                <TabContent value="airline-markup">
                    <Card className="border-2 border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-5">
                            <div className="mb-2 font-bold text-lg text-gray-900 dark:text-gray-100">
                                Airline Class Markup Rates
                            </div>
                            <div className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
                                Set markup rates for specific airlines and each class. Add new airlines as needed.
                            </div>
                            <AirlineMarkupTableSection airlineMarkups={airlineMarkups} setAirlineMarkups={setAirlineMarkups} />
                        </div>
                    </Card>
                </TabContent>
            </Tabs>
        </div>
    )
}

export default ConfigurationContent
