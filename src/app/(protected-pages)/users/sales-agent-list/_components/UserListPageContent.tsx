'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Loading from '@/components/shared/Loading'
import UserListProvider from './UserListProvider'
import UserListTable from './UserListTable'
import UserListActionTools from './UserListActionTools'
import UserListTableTools from './UserListTableTools'
import UserListSelected from './UserListSelected'
import { userService } from '@/services/user/userService'
import type { User } from '../types'

const UserListPageContent = () => {
    const searchParams = useSearchParams()
    const pageIndex = parseInt(searchParams.get('pageIndex') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || undefined
    const orderBy = searchParams.get('orderBy') || 'createdAt'
    const orderDirection =
        (searchParams.get('orderDirection') as 'asc' | 'desc') || 'asc'

    const [loading, setLoading] = useState(true)
    const [list, setList] = useState<User[]>([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        let cancelled = false
        setLoading(true)

        userService
            .getList({
                page: pageIndex,
                perPage: pageSize,
                search,
                orderBy,
                orderDirection,
            })
            .then((res) => {
                if (!cancelled) {
                    setList(res.data)
                    setTotal(res._metadata.pagination.total)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setList([])
                    setTotal(0)
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [pageIndex, pageSize, search, orderBy, orderDirection])

    if (loading) {
        return (
            <Container>
                <Loading loading={true} type="cover">
                    <div className="h-64" />
                </Loading>
            </Container>
        )
    }

    return (
        <UserListProvider userList={list}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Sales Agents</h3>
                            <UserListActionTools />
                        </div>
                        <UserListTableTools search={search} />
                        <UserListTable
                            userListTotal={total}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
            <UserListSelected />
        </UserListProvider>
    )
}

export default UserListPageContent
