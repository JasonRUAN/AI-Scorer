import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { Contest } from "@/types";
import { aiScorerContractConfig } from "@/constants/ContractConfig";
import { QueryKey } from "@/constants";

// 定义合约返回的原始Contest结构
interface ContractContest {
    id: bigint;
    title: string;
    description: string;
    prompt: string;
    startTime: bigint;
    endTime: bigint;
    deadline: bigint;
    maxWords: bigint;
    reward: bigint;
    status: number;
    participantCount: bigint;
    participants: string[];
    rewardDistributed: boolean;
}

// 状态映射函数
function mapContestStatus(status: number): "upcoming" | "active" | "ended" {
    switch (status) {
        case 0:
            return "upcoming";
        case 1:
            return "active";
        case 2:
            return "ended";
        default:
            return "upcoming";
    }
}

// 转换合约数据为前端类型
function transformContractContest(contractContest: ContractContest): Contest {
    return {
        id: contractContest.id.toString(),
        title: contractContest.title,
        description: contractContest.description,
        prompt: contractContest.prompt,
        startTime: new Date(Number(contractContest.startTime) * 1000),
        endTime: new Date(Number(contractContest.endTime) * 1000),
        deadline: new Date(Number(contractContest.deadline) * 1000),
        maxWords: Number(contractContest.maxWords),
        reward: contractContest.reward.toString(),
        status: mapContestStatus(contractContest.status),
        participantCount: Number(contractContest.participantCount),
    };
}

export function useGetMultipleContests({
    contestIds,
}: {
    contestIds: string[];
}) {
    const publicClient = usePublicClient();

    return useQuery({
        queryKey: [QueryKey.GetMultipleContestsQueryKey, contestIds],
        queryFn: async () => {
            if (!publicClient) throw new Error("Public client not found");

            const promises = contestIds.map(async (contestId) => {
                try {
                    const result = (await publicClient.readContract({
                        address:
                            aiScorerContractConfig.address as `0x${string}`,
                        abi: aiScorerContractConfig.abi,
                        functionName: "getContest",
                        args: [Number(contestId)],
                    })) as ContractContest;

                    return transformContractContest(result);
                } catch (error) {
                    console.error(
                        `Failed to fetch contest ${contestId}:`,
                        error
                    );
                    return null;
                }
            });

            const results = await Promise.all(promises);
            // 过滤掉null值（获取失败的比赛）
            return results.filter(
                (contest): contest is Contest => contest !== null
            );
        },
        enabled: contestIds.length > 0 && !!publicClient,
    });
}
