import BookingDetail from './_components/BookingDetail'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    return <BookingDetail bookingId={params.id} />
}
