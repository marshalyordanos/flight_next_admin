import { cookies } from 'next/headers'
import Container from '@/components/shared/Container'
import ProfileContent from './_components/ProfileContent'
import { userService } from '@/services/user/userService'
import { AUTH_TOKEN_KEY } from '@/constants/auth.constant'

export default async function ProfilePage() {
    let profileData = null
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(AUTH_TOKEN_KEY)?.value

        const res = await userService.getProfile(accessToken)
        profileData = res.data
    } catch {
        profileData = null
    }

    return (
        <Container>
            <ProfileContent initialData={profileData} />
        </Container>
    )
}
