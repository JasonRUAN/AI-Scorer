import { useReadContract } from "wagmi";
import { toast } from "sonner";
import { aiScorerContractConfig } from "@/constants/ContractConfig";
import { Contest } from "@/types";

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

export function useGetOneContest({
    contestId,
}: {
    contestId: string | number;
}) {
    const numericContestId =
        typeof contestId === "string" ? parseInt(contestId, 10) : contestId;

    const {
        data: rawData,
        isPending,
        error,
        refetch,
    } = useReadContract({
        address: aiScorerContractConfig.address as `0x${string}`,
        abi: aiScorerContractConfig.abi,
        functionName: "getContest",
        args: [numericContestId],
        query: {
            enabled: !!numericContestId && !isNaN(numericContestId),
        },
    });

    if (!contestId || isNaN(numericContestId)) {
        return {
            data: undefined,
            isPending: false,
            error: null,
            refetch,
        };
    }

    if (error) {
        toast.error(`获取比赛详情失败: ${error.message}`);
        return {
            data: undefined,
            isPending,
            error,
            refetch,
        };
    }

    if (isPending) {
        return {
            data: undefined,
            isPending,
            error: null,
            refetch,
        };
    }

    // 转换合约数据为前端类型
    const transformedData = rawData
        ? transformContractContest(rawData as ContractContest)
        : undefined;

    return {
        data: transformedData,
        isPending,
        error: null,
        refetch,
    };
}
