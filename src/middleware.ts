import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
    authRoutes as _authRoutes,
    publicRoutes as _publicRoutes,
} from '@/configs/routes.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'
import { AUTH_TOKEN_KEY } from '@/constants/auth.constant'

const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)
const authRoutes = Object.entries(_authRoutes).map(([key]) => key)

export function middleware(req: NextRequest) {
    const { nextUrl } = req
    const token = req.cookies.get(AUTH_TOKEN_KEY)?.value
    const isSignedIn = !!token

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isAuthRoute) {
        if (isSignedIn) {
            return NextResponse.redirect(
                new URL(appConfig.authenticatedEntryPath, nextUrl),
            )
        }
        return NextResponse.next()
    }

    if (!isSignedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }
        return NextResponse.redirect(
            new URL(
                `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${callbackUrl}`,
                nextUrl,
            ),
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
}
