'use client'

import { useEffect } from 'react'
import { useUserListStore } from '../_store/userListStore'
import type { User } from '../types'
import type { CommonProps } from '@/@types/common'

interface UserListProviderProps extends CommonProps {
    userList: User[]
}

const UserListProvider = ({ userList, children }: UserListProviderProps) => {
    const setUserList = useUserListStore((state) => state.setUserList)
    const setInitialLoading = useUserListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setUserList(userList)
        setInitialLoading(false)
    }, [userList, setUserList, setInitialLoading])

    return <>{children}</>
}

export default UserListProvider
