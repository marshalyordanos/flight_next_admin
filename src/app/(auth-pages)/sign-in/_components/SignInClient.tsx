'use client'

import SignIn from '@/components/auth/SignIn'
import { useAuth } from '@/contexts/AuthContext'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useSearchParams } from 'next/navigation'
import type { OnSignInPayload } from '@/components/auth/SignIn'

export default function SignInClient() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get(REDIRECT_URL_KEY) ?? undefined
    const { signIn } = useAuth()

    const handleSignIn = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignInPayload) => {
        setSubmitting(true)
        const { error } = await signIn(values, callbackUrl)
        if (error) {
            setMessage(error)
        }
        setSubmitting(false)
    }

    return <SignIn onSignIn={handleSignIn} />
}
