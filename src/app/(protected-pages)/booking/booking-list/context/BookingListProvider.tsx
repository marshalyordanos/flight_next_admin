import React, { createContext, useContext, useState } from 'react'

export const BookingListContext = createContext({
    bookingList: [],
    setBookingList: () => {},
})

export const useBookingList = () => useContext(BookingListContext)

const BookingListProvider = ({ children, bookingList: initialList }) => {
    const [bookingList, setBookingList] = useState(initialList || [])
    return (
        <BookingListContext.Provider value={{ bookingList, setBookingList }}>
            {children}
        </BookingListContext.Provider>
    )
}

export default BookingListProvider
