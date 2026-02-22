'use client'

import Card from '@/components/ui/Card'
import UserProfileSection from './UserProfileSection'
import type { User } from '@/app/(protected-pages)/users/user-list/types'
import { BadgeCheck, Mail, Flag, UserCircle, Calendar, ShieldCheck } from 'lucide-react'

type UserDetailsProps = {
    data: User
}

// Unified icon color (black)
const iconClass = "w-5 h-5 text-black"

// Subtler, professional badge color palette
const badgeColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700 border-green-300'
        case 'inactive':
            return 'bg-gray-100 text-gray-500 border-gray-200'
        case 'banned':
            return 'bg-red-100 text-red-700 border-red-300'
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200'
    }
}

// Streamlined, smaller InfoRow
const InfoRow = ({
    icon,
    label,
    value,
    valueClass = '',
    children,
}: {
    icon: React.ReactNode
    label: string
    value?: React.ReactNode
    valueClass?: string
    children?: React.ReactNode
}) => (
    <div className="flex items-center gap-3">
        <div className="flex-none">{icon}</div>
        <div className="w-28 min-w-fit text-xs font-medium text-gray-400">{label}</div>
        <div className={`flex-1 text-sm font-semibold ${valueClass}`}>{value}{children}</div>
    </div>
)

const UserDetails = ({ data }: UserDetailsProps) => {
    return (
        <div className="flex flex-col xl:flex-row gap-7 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6">
            {/* Profile Side Panel */}
            <aside className="min-w-[280px] 2xl:min-w-[320px]">
                <UserProfileSection data={data} />
            </aside>
            {/* Info Card */}
            <Card className="flex-1 shadow rounded-2xl border border-blue-50 bg-white/95 backdrop-blur transition">
                <div className="p-8">
                    <header className="mb-5 flex items-center gap-2 border-b pb-3 border-blue-50">
                        <UserCircle className={iconClass} />
                        <h2 className="text-lg font-semibold text-blue-950 tracking-tight">
                            User Information
                        </h2>
                    </header>
                    <div className="space-y-4">
                        <InfoRow
                            icon={<Mail className={iconClass} />}
                            label="Email"
                            value={data.email}
                        />
                        <InfoRow
                            icon={<ShieldCheck className={iconClass} />}
                            label="Role"
                        >
                            <span className="font-semibold text-gray-700">{data.role?.name}</span>
                            {data.role?.type && (
                                <span className="ml-2 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-block align-middle">
                                    {data.role?.type}
                                </span>
                            )}
                        </InfoRow>
                        <InfoRow
                            icon={<Flag className={iconClass} />}
                            label="Country"
                            value={data.country?.name}
                        />
                        <InfoRow
                            icon={<BadgeCheck className={iconClass} />}
                            label="Status"
                        >
                            <span
                                className={`capitalize px-3 py-0.5 rounded-full text-xs border font-semibold tracking-wide shadow-sm ${badgeColor(
                                    data.status
                                )}`}
                            >
                                {data.status}
                            </span>
                        </InfoRow>
                        {data.passwordExpired && (
                            <InfoRow
                                icon={<Calendar className={iconClass + " text-rose-500"} />}
                                label="Password Expires"
                                value={
                                    new Date(data.passwordExpired).toLocaleDateString()
                                }
                                valueClass="text-rose-600"
                            />
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default UserDetails
