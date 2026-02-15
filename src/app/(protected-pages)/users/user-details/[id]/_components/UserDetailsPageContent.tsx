'use client'

import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import UserDetails from './UserDetails'
import NoUserFound from '@/assets/svg/NoUserFound'
import Loading from '@/components/shared/Loading'
import { userService } from '@/services/user/userService'
import type { User } from '@/app/(protected-pages)/users/user-list/types'

type UserDetailsPageContentProps = {
    userId: string
}

const UserDetailsPageContent = ({ userId }: UserDetailsPageContentProps) => {
    const [data, setData] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(false)

        userService
            .getOne(userId)
            .then((res) => {
                if (!cancelled) {
                    setData(res.data)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError(true)
                    setData(null)
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [userId])

    if (loading) {
        return (
            <Container>
                <Loading loading={true} type="cover">
                    <div className="h-64" />
                </Loading>
            </Container>
        )
    }

    if (error || !data) {
        return (
            <Container>
                <div className="h-full flex flex-col items-center justify-center py-16">
                    <NoUserFound height={280} width={280} />
                    <h2 className="mt-4">No user found!</h2>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <UserDetails data={data} />
        </Container>
    )
}

export default UserDetailsPageContent
