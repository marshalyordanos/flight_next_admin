// Shared types for booking detail
export interface TravellerInfo {
    fullName?: string
    email?: string
    gender?: string
    phoneNumber?: string
    passengerType?: string
    dob?: string
    passportNumber?: string
    passportIssuingCountry?: string
    passportExpiry?: string
}
export interface BookedBy {
    name?: string
    email?: string
    username?: string
    status?: string
}
export interface BookingDetailType {
    travellerInfo?: TravellerInfo[]
    bookedBy?: BookedBy
    paymentStatus?: string
    bookerType?: string
    createdAt?: string
    updatedAt?: string
    pnr?: string
    isActive?: boolean
    deleted?: boolean
    basePayment?: string | number
    paymentAmountInETB?: string | number
    paymentAmountInPreferredCurrency?: string | number
    userPaymentCurrency?: string
    userPaymentExpirationDate?: string
    markupRateInETB?: string | number
    paymentCommissionInETB?: string | number
    airPricingSolutionTotalPrice?: string | number
}
