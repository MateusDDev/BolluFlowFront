import { MenuPageContainer } from '@/features/menu/components/MenuPageContainer'

interface Props {
    params: Promise<{ slug: string }>
}

export default async function MenuPage({ params }: Props) {
    const { slug } = await params
    return <MenuPageContainer slug={slug} />
}
