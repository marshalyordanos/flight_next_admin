import UserEditPageContent from './_components/UserEditPageContent'

export default async function Page(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    return <UserEditPageContent userId={params.id} />
}
