import { cookies } from 'next/headers'
import { userService } from '@/services/user/userService'
import { AUTH_TOKEN_KEY } from '@/constants/auth.constant'

const getUsers = async (queryParams: {
    [key: string]: string | string[] | undefined
}) => {
    const page = parseInt((queryParams.pageIndex as string) || '1')
    const perPage = parseInt((queryParams.pageSize as string) || '10')
    const search =
        (queryParams.search as string) ||
        (queryParams.query as string) ||
        undefined
    const orderBy =
        (queryParams.orderBy as string) ||
        (queryParams.sortKey as string) ||
        'createdAt'
    const orderDirection =
        ((queryParams.orderDirection as string) ||
            (queryParams.order as string) ||
            'asc') as 'asc' | 'desc'

    const cookieStore = await cookies()
    const accessToken = cookieStore.get(AUTH_TOKEN_KEY)?.value

    const res = await userService.getList({
        page,
        perPage,
        search,
        orderBy,
        orderDirection,
        accessToken,
    })

    return {
        list: res.data,
        total: res._metadata.pagination.total,
        pagination: res._metadata.pagination,
    }
}

export default getUsers
