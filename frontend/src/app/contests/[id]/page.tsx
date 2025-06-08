import ContestDetailPage from "@/components/pages/ContestDetailPage";

export default async function ContestDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <ContestDetailPage contestId={id} />;
}
