import { useMutation } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";
import { aiScorerContractConfig } from "@/constants/ContractConfig";

interface ContestInfo {
    title: string;
    description: string;
    prompt: string;
    startTime: number;
    endTime: number;
    deadline: number;
    maxWords: number;
    reward: number;
}

export interface Contest extends ContestInfo {
    id: string;
    status: "active" | "ended" | "pending";
    participantCount?: number;
    rewardDistributed?: boolean;
}

export function useCreateContest() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    return useMutation({
        mutationFn: async (info: ContestInfo) => {
            if (!address) {
                throw new Error("你需要先连接钱包！");
            }

            // 将 ether 转换为 wei (1 ether = 10^18 wei)
            const value = BigInt(Math.floor(info.reward * 1e18));

            const result = await writeContractAsync({
                address: aiScorerContractConfig.address as `0x${string}`,
                abi: aiScorerContractConfig.abi,
                functionName: "createContest",
                args: [
                    info.title,
                    info.description,
                    info.prompt,
                    info.startTime,
                    info.endTime,
                    info.deadline,
                    info.maxWords,
                ],
                value,
            });

            return result;
        },
        onError: (error) => {
            console.error("创建比赛失败:", error);
            throw error;
        },
        onSuccess: (data) => {
            console.log("成功创建比赛:", data);
        },
    });
}
