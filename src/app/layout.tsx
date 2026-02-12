import { NextIntlClientProvider } from 'next-intl'
import { AuthProvider } from '@/contexts/AuthContext'
import ThemeProvider from '@/components/template/Theme/ThemeProvider'
import pageMetaConfig from '@/configs/page-meta.config'
import NavigationProvider from '@/components/template/Navigation/NavigationProvider'
import { getNavigation } from '@/server/actions/navigation/getNavigation'
import { getTheme } from '@/server/actions/theme'
import { getLocale } from '@/server/actions/locale'
import type { ReactNode } from 'react'
import '@/assets/styles/app.css'

export const metadata = {
    ...pageMetaConfig,
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const navigationTree = await getNavigation()
    const theme = await getTheme()
    const locale = await getLocale()

    return (
        <html
            lang={locale}
            className={theme.mode === 'dark' ? 'dark' : 'light'}
            dir={theme.direction}
            suppressHydrationWarning
        >
            <body suppressHydrationWarning>
                <NextIntlClientProvider>
                    <ThemeProvider theme={theme}>
                        <AuthProvider>
                            <NavigationProvider navigationTree={navigationTree}>
                                {children}
                            </NavigationProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
