import { useReadContract } from "wagmi";
import { aiScorerContractConfig } from "@/constants/ContractConfig";
import { useGetMultipleContests } from "./useGetMultipleContests";

export function useGetAllContests() {
    const { data: allContestIds } = useReadContract({
        address: aiScorerContractConfig.address as `0x${string}`,
        abi: aiScorerContractConfig.abi,
        functionName: "getAllContests",
    });

    console.log(">>>", allContestIds);

    // 将bigint转换为string数组，添加类型检查
    const contestIdsAsStrings =
        (allContestIds as bigint[] | undefined)?.map((id: bigint) =>
            id.toString()
        ) || [];

    // 使用现有的useGetMultipleGoals hook获取目标详情
    const { data: goals } = useGetMultipleContests({
        contestIds: contestIdsAsStrings,
    });

    return {
        data: goals || [],
        isLoading: false,
        error: null,
    };
}
