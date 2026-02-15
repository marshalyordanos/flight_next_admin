'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Tabs from '@/components/ui/Tabs'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { configurationService } from '@/services/configuration/configurationService'
import { HiCurrencyDollar, HiReceiptTax } from 'react-icons/hi'

const { TabNav, TabList, TabContent } = Tabs

type RateCardProps = {
    title: string
    description: string
    icon: React.ReactNode
    value: number | null
    loading: boolean
    onSave: (value: number) => Promise<void>
}

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

const ConfigurationContent = () => {
    const [activeTab, setActiveTab] = useState('markup')
    const [markupValue, setMarkupValue] = useState<number | null>(null)
    const [taxValue, setTaxValue] = useState<number | null>(null)
    const [markupLoading, setMarkupLoading] = useState(true)
    const [taxLoading, setTaxLoading] = useState(true)

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
        } else {
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
                {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Configuration
                </h2> */}
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Manage markup rate and tax rate settings
                </p>
            </div>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <TabList className="mb-6">
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
                    <RateCard
                        title="Markup Rate"
                        description="Set the default markup percentage applied to products. This rate will be used when calculating selling prices."
                        icon={<HiCurrencyDollar />}
                        value={markupValue}
                        loading={markupLoading}
                        onSave={handleSaveMarkup}
                    />
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
            </Tabs>
        </div>
    )
}

export default ConfigurationContent
