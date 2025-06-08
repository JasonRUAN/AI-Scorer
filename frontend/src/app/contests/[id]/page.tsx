import ContestDetailPage from "@/components/pages/ContestDetailPage";

export default function ContestDetail({ params }: { params: { id: string } }) {
    return <ContestDetailPage contestId={params.id} />;
}
