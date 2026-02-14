'use client'

import Card from '@/components/ui/Card'
import UserProfileSection from './UserProfileSection'
import type { User } from '@/app/(protected-pages)/users/user-list/types'

type UserDetailsProps = {
    data: User
}

const UserDetails = ({ data }: UserDetailsProps) => {
    return (
        <div className="flex flex-col xl:flex-row gap-4">
            <div className="min-w-[330px] 2xl:min-w-[400px]">
                <UserProfileSection data={data} />
            </div>
            <Card className="w-full">
                <div className="p-4">
                    <h6 className="mb-4">User Information</h6>
                    <div className="space-y-2">
                        <p>
                            <span className="font-semibold">Email: </span>
                            {data.email}
                        </p>
                        <p>
                            <span className="font-semibold">Role: </span>
                            {data.role?.name} ({data.role?.type})
                        </p>
                        <p>
                            <span className="font-semibold">Country: </span>
                            {data.country?.name}
                        </p>
                        <p>
                            <span className="font-semibold">Status: </span>
                            {data.status}
                        </p>
                        {data.passwordExpired && (
                            <p>
                                <span className="font-semibold">
                                    Password Expires:{' '}
                                </span>
                                {new Date(
                                    data.passwordExpired,
                                ).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default UserDetails
