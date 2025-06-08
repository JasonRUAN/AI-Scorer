import { Contest } from "@/types";
import { Clock, AlertCircle, CheckCircle, LucideIcon } from "lucide-react";

/**
 * 根据时间判断比赛状态
 * @param contest 比赛对象
 * @returns 比赛状态：upcoming | active | ended
 */
export const getContestStatus = (contest: Contest): Contest["status"] => {
    const now = Date.now();
    const startTime = new Date(contest.startTime).getTime();
    const endTime = new Date(contest.endTime).getTime();

    if (now < startTime) {
        return "upcoming";
    } else if (now >= startTime && now < endTime) {
        return "active";
    } else {
        return "ended";
    }
};

/**
 * 获取状态对应的颜色样式
 * @param status 比赛状态
 * @returns CSS类名
 */
export const getStatusColor = (status: Contest["status"]) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
        case "upcoming":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
        case "ended":
            return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
};

/**
 * 获取状态对应的文本
 * @param status 比赛状态
 * @returns 状态文本
 */
export const getStatusText = (status: Contest["status"]) => {
    switch (status) {
        case "active":
            return "进行中";
        case "upcoming":
            return "即将开始";
        case "ended":
            return "已结束";
    }
};

/**
 * 获取状态对应的图标组件
 * @param status 比赛状态
 * @returns Lucide图标组件
 */
export const getStatusIcon = (status: Contest["status"]): LucideIcon => {
    switch (status) {
        case "active":
            return Clock;
        case "upcoming":
            return AlertCircle;
        case "ended":
            return CheckCircle;
    }
};
