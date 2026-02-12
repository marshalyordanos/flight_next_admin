export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    activeNavTranslation: boolean
    apiKey: string
    apiKeyHeaderName: string
}

const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? 'https://flight.yonashalefom.com/api/v1'

// Set your API key and its header name here
const apiKey = 'v8VB0yY887lMpTA2VJMV:zeZbtGTugBTn3Qd5UXtSZBwt7gn3bg'
const apiKeyHeaderName = 'x-api-key'

const appConfig: AppConfig = {
    apiPrefix: apiBaseUrl,
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    activeNavTranslation: true,
    apiKey,
    apiKeyHeaderName,
}

export default appConfig
