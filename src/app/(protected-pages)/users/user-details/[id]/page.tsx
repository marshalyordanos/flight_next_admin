import UserDetailsPageContent from './_components/UserDetailsPageContent'

export default async function Page(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    return <UserDetailsPageContent userId={params.id} />
}
