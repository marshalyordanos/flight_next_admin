import { useAuth } from '@/contexts/AuthContext'

const useCurrentSession = () => {
    const { user, isLoading } = useAuth()

    return {
        session: user
            ? {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: undefined,
                    authority: user.role ? [user.role.type] : [],
                },
                expires: '',
            }
            : { expires: '', user: {} },
        user,
        isLoading,
    }
}

export default useCurrentSession
