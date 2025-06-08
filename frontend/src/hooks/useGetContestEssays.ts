import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { Essay } from "@/types";
import { aiScorerContractConfig } from "@/constants/ContractConfig";
import { QueryKey } from "@/constants";

// 定义合约返回的原始Essay结构
interface ContractEssay {
    id: bigint;
    contestId: bigint;
    author: string;
    title: string;
    contentHash: string;
    submittedAt: bigint;
    aiScore: bigint;
    feedback: string;
    status: number;
}

// 状态映射函数
function mapEssayStatus(status: number): "submitted" | "grading" | "graded" {
    switch (status) {
        case 0:
            return "submitted";
        case 1:
            return "grading";
        case 2:
            return "graded";
        default:
            return "submitted";
    }
}

// 转换合约数据为前端类型
function transformContractEssay(contractEssay: ContractEssay): Essay {
    return {
        id: contractEssay.id.toString(),
        contestId: contractEssay.contestId.toString(),
        authorAddress: contractEssay.author,
        authorName: contractEssay.author, // 暂时使用地址作为名称，可以后续优化
        title: contractEssay.title,
        content: contractEssay.contentHash, // 这里存储的是内容哈希，实际内容需要从IPFS或其他存储获取
        submittedAt: new Date(Number(contractEssay.submittedAt) * 1000),
        aiScore: Number(contractEssay.aiScore),
        feedback: contractEssay.feedback,
        status: mapEssayStatus(contractEssay.status),
    };
}

export function useGetContestEssays({
    contestId,
}: {
    contestId: string | number;
}) {
    const publicClient = usePublicClient();
    const numericContestId =
        typeof contestId === "string" ? parseInt(contestId, 10) : contestId;

    return useQuery({
        queryKey: [QueryKey.GetContestEssaysQueryKey, contestId],
        queryFn: async () => {
            if (!publicClient) throw new Error("Public client not found");

            // 第一步：调用 getContestEssays 获取文章ID数组
            const essayIds = (await publicClient.readContract({
                address: aiScorerContractConfig.address as `0x${string}`,
                abi: aiScorerContractConfig.abi,
                functionName: "getContestEssays",
                args: [numericContestId],
            })) as bigint[];

            // 如果没有文章，直接返回空数组
            if (!essayIds || essayIds.length === 0) {
                return [];
            }

            // 第二步：对每个文章ID调用 getEssay 获取详细信息
            const promises = essayIds.map(async (essayId) => {
                try {
                    const result = (await publicClient.readContract({
                        address:
                            aiScorerContractConfig.address as `0x${string}`,
                        abi: aiScorerContractConfig.abi,
                        functionName: "getEssay",
                        args: [essayId],
                    })) as ContractEssay;

                    return transformContractEssay(result);
                } catch (error) {
                    console.error(
                        `Failed to fetch essay ${essayId.toString()}:`,
                        error
                    );
                    return null;
                }
            });

            const results = await Promise.all(promises);
            // 过滤掉null值（获取失败的文章）
            return results.filter((essay): essay is Essay => essay !== null);
        },
        enabled: !!contestId && !isNaN(numericContestId) && !!publicClient,
    });
}
