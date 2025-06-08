import { Contest, Essay, User, Ranking } from "@/types";

// Mock 比赛数据
export const mockContests: Contest[] = [
    {
        id: "1",
        title: "未来科技展望",
        description: "描述你对未来20年科技发展的看法和预测",
        prompt: '请以"未来科技展望"为主题，结合当前科技发展趋势，描述你对未来20年科技发展的看法和预测。字数要求800-1200字。',
        startTime: new Date("2024-01-01T00:00:00Z"),
        endTime: new Date("2024-12-31T23:59:59Z"),
        deadline: new Date("2024-12-31T23:59:59Z"),
        maxWords: 1200,
        reward: "100 SUI",
        status: "active",
        participantCount: 156,
    },
    {
        id: "2",
        title: "环保与可持续发展",
        description: "探讨环保在现代社会中的重要性和实践方法",
        prompt: '请以"环保与可持续发展"为主题，探讨环保在现代社会中的重要性，并提出具体的实践方法。字数要求600-1000字。',
        startTime: new Date("2024-02-01T00:00:00Z"),
        endTime: new Date("2024-02-28T23:59:59Z"),
        deadline: new Date("2024-02-28T23:59:59Z"),
        maxWords: 1000,
        reward: "50 SUI",
        status: "ended",
        participantCount: 89,
    },
    {
        id: "3",
        title: "数字时代的教育变革",
        description: "分析数字技术对教育的影响和未来发展趋势",
        prompt: '请以"数字时代的教育变革"为主题，分析数字技术对教育的影响，并预测未来教育的发展趋势。字数要求800-1200字。',
        startTime: new Date("2024-03-01T00:00:00Z"),
        endTime: new Date("2024-03-31T23:59:59Z"),
        deadline: new Date("2024-03-31T23:59:59Z"),
        maxWords: 1200,
        reward: "75 SUI",
        status: "upcoming",
        participantCount: 0,
    },
];

// Mock 用户数据
export const mockUsers: User[] = [
    {
        address: "0x1234567890abcdef",
        name: "Alex Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        joinedAt: new Date("2024-01-15T10:30:00Z"),
        submissionsCount: 3,
        averageScore: 85.5,
        rank: 1,
    },
    {
        address: "0xabcdef1234567890",
        name: "Sarah Wang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        joinedAt: new Date("2024-01-20T14:20:00Z"),
        submissionsCount: 2,
        averageScore: 78.0,
        rank: 2,
    },
];

// Mock 作文数据
export const mockEssays: Essay[] = [
    {
        id: "1",
        contestId: "1",
        authorAddress: "0x1234567890abcdef",
        authorName: "Alex Chen",
        title: "人工智能重塑人类未来",
        content: "随着人工智能技术的快速发展，我们正站在一个历史性的转折点...",
        submittedAt: new Date("2024-01-20T15:30:00Z"),
        aiScore: 92,
        feedback:
            "文章结构清晰，论证有力，对AI发展趋势的分析深入透彻。建议在部分段落中加入更多具体实例。",
        status: "graded",
    },
    {
        id: "2",
        contestId: "1",
        authorAddress: "0xabcdef1234567890",
        authorName: "Sarah Wang",
        title: "科技与人文的平衡发展",
        content: "在科技飞速发展的今天，我们不能忽视人文精神的重要性...",
        submittedAt: new Date("2024-01-22T09:15:00Z"),
        aiScore: 88,
        feedback:
            "观点独特，文笔流畅，体现了深度思考。建议在结论部分进一步强化核心观点。",
        status: "graded",
    },
];

// Mock 排行榜数据
export const mockRankings: Ranking[] = [
    {
        essayId: "1",
        contestId: "1",
        authorAddress: "0x1234567890abcdef",
        authorName: "Alex Chen",
        score: 92,
        rank: 1,
        essayTitle: "人工智能重塑人类未来",
    },
    {
        essayId: "2",
        contestId: "1",
        authorAddress: "0xabcdef1234567890",
        authorName: "Sarah Wang",
        score: 88,
        rank: 2,
        essayTitle: "科技与人文的平衡发展",
    },
];

// Mock AI 评分函数
export const mockAIScore = async (
    essay: string
): Promise<{ score: number; feedback: string }> => {
    // 模拟AI评分延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 基于文章长度给出不同的评分范围
    const wordCount = essay.split(" ").length;
    const baseScore = Math.min(100, Math.max(60, wordCount * 0.1 + 70));
    const score = Math.floor(baseScore + Math.random() * 10 - 5); // 加入随机因子

    const feedback = `这篇文章整体质量不错，得分${score}分。文章结构清晰，论证较为有力。建议在某些段落中加入更多具体实例来支撑观点。`;

    return { score, feedback };
};
