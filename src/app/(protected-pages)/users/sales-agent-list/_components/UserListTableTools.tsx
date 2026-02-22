'use client'

import UserListSearch from './UserListSearch'
import UserListTableFilter from './UserListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

type UserListTableToolsProps = {
    search?: string
}

const UserListTableTools = (props: UserListTableToolsProps) => {
    const { search } = props
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (query: string) => {
        onAppendQueryParams({
            search: query,
            pageIndex: '1',
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <UserListSearch search={search} onInputChange={handleInputChange} />
            <UserListTableFilter />
        </div>
    )
}

export default UserListTableTools
