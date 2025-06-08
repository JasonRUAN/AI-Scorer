import { useMutation } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";
import { aiScorerContractConfig } from "@/constants/ContractConfig";

interface EssaySubmission {
    contestId: string;
    title: string;
    contentHash: string;
}

export interface Essay {
    id: string;
    contestId: string;
    authorAddress: string;
    title: string;
    contentHash: string;
    submittedAt: Date;
    aiScore?: number;
    feedback?: string;
    status: "submitted" | "grading" | "graded";
}

export function useSubmitEssay() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    return useMutation({
        mutationFn: async (submission: EssaySubmission) => {
            if (!address) {
                throw new Error("你需要先连接钱包！");
            }

            // 将字符串类型的contestId转换为数字
            const contestIdNumber = parseInt(submission.contestId);
            if (isNaN(contestIdNumber)) {
                throw new Error("无效的比赛ID");
            }

            const result = await writeContractAsync({
                address: aiScorerContractConfig.address as `0x${string}`,
                abi: aiScorerContractConfig.abi,
                functionName: "submitEssay",
                args: [
                    contestIdNumber,
                    submission.title,
                    submission.contentHash,
                ],
            });

            return result;
        },
        onError: (error) => {
            console.error("提交文章失败:", error);
            throw error;
        },
        onSuccess: (data) => {
            console.log("成功提交文章:", data);
        },
    });
}
