import { cookies } from 'next/headers'
import { userService } from '@/services/user/userService'
import { AUTH_TOKEN_KEY } from '@/constants/auth.constant'

const getUser = async (params: { id: string }) => {
    const { id } = params

    if (!id) {
        return null
    }

    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(AUTH_TOKEN_KEY)?.value

        const res = await userService.getOne(id, accessToken)
        return res.data
    } catch {
        return null
    }
}

export default getUser
