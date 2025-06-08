"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    PenTool,
    Send,
    Clock,
    FileText,
    Award,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Brain,
    Sparkles,
} from "lucide-react";
import { mockContests } from "@/lib/mock-data";
import { getContestStatus } from "@/lib/contest-utils";
import { useGetAllContests } from "@/hooks/useGetAllContests";
import { useSubmitEssay } from "@/mutations/submit_essay";
import { CONSTANTS } from "@/constants";

export default function SubmitEssayPage() {
    const [selectedContest, setSelectedContest] = useState("");
    const [essayTitle, setEssayTitle] = useState("");
    const [essayContent, setEssayContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGrading, setIsGrading] = useState(false);
    const [aiResult, setAiResult] = useState<{
        score: number;
        feedback: string;
    } | null>(null);

    // 获取真实比赛数据
    const { data: contests = [] } = useGetAllContests();

    // 使用区块链提交hook
    const submitEssayMutation = useSubmitEssay();

    // 如果没有真实数据，使用模拟数据作为后备
    const contestsToUse = contests.length > 0 ? contests : mockContests;

    const activeContests = contestsToUse.filter(
        (contest) => getContestStatus(contest) === "active"
    );
    const selectedContestData = contestsToUse.find(
        (c) => c.id === selectedContest
    );

    const wordCount = essayContent
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    const maxWords = selectedContestData?.maxWords || 1000;
    const wordProgress = Math.min((wordCount / maxWords) * 100, 100);
    const isOverLimit = wordCount > maxWords;

    const handleSubmit = async () => {
        if (!selectedContest || !essayTitle.trim() || !essayContent.trim()) {
            toast.error("请填写完整的作文信息");
            return;
        }

        if (isOverLimit) {
            toast.error("作文字数超过限制");
            return;
        }

        setIsSubmitting(true);

        try {
            // Start AI grading
            setIsGrading(true);

            try {
                // 调用AI评分的API
                const response = await fetch(
                    // `${CONSTANTS.BACKEND_URL}/deepseek/get_ai_score`,
                    `${CONSTANTS.BACKEND_URL}/deepseek/get_ai_suggestion`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            content: essayContent,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // 解析评分 - 从message中提取"总分：XX / 100 分"中的XX
                let score = 0;
                const scoreMatch = result.message.match(
                    /总分：(\d+)\s*\/\s*100\s*分/
                );
                if (scoreMatch) {
                    score = parseInt(scoreMatch[1], 10);
                }

                setAiResult({
                    score: score,
                    feedback: result.message,
                });

                setIsGrading(false); // AI评分完成，立即更新状态
                toast.success(`AI评分完成！得分：${score}分`);

                // 稍微延迟一下，让用户看到评分结果
                await new Promise((resolve) => setTimeout(resolve, 100));

                // AI评分完成后，提交到区块链
                try {
                    // 当前文档内容，直接存链上，未来考虑存链下，链上存Hash
                    const contentHash = essayContent;

                    await submitEssayMutation.mutateAsync({
                        contestId: selectedContest,
                        title: essayTitle,
                        contentHash: contentHash,
                        _score: score,
                        _feedback: result.message,
                    });

                    toast.success("作文提交成功！已上链保存");

                    // 提交成功后重置表单
                    setSelectedContest("");
                    setEssayTitle("");
                    setEssayContent("");
                    setAiResult(null);
                } catch (blockchainError) {
                    console.error("区块链提交失败:", blockchainError);
                    // 更友好的错误处理
                    if (blockchainError instanceof Error) {
                        if (blockchainError.message.includes("User rejected")) {
                            toast.error("用户取消了交易");
                        } else if (
                            blockchainError.message.includes(
                                "insufficient funds"
                            )
                        ) {
                            toast.error("余额不足，无法完成交易");
                        } else {
                            toast.error(
                                `区块链提交失败: ${blockchainError.message}`
                            );
                        }
                    } else {
                        toast.error("区块链提交失败，但AI评分已完成");
                    }
                }
            } catch (error) {
                console.error("AI评分失败:", error);
                toast.error("AI评分失败，请重试");
                setAiResult(null);
                setIsGrading(false);
            }
        } catch {
            toast.error("提交失败，请重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getWordCountColor = () => {
        if (isOverLimit) return "text-red-500";
        if (wordProgress > 80) return "text-orange-500";
        return "text-green-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        提交作文
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        选择参赛比赛，创作您的作品，让AI为您的才华打分
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contest Selection */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <PenTool className="w-5 h-5 mr-2" />
                                            选择比赛
                                        </CardTitle>
                                        <CardDescription>
                                            请选择您要参与的作文比赛
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Select
                                            value={selectedContest}
                                            onValueChange={setSelectedContest}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="选择一个活跃的比赛" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {activeContests.map(
                                                    (contest) => (
                                                        <SelectItem
                                                            key={contest.id}
                                                            value={contest.id}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <span>
                                                                    {
                                                                        contest.title
                                                                    }
                                                                </span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="ml-2"
                                                                >
                                                                    {Number(
                                                                        contest.reward
                                                                    ) /
                                                                        10 **
                                                                            18}{" "}
                                                                    MON
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Selected Contest Info */}
                            {selectedContestData && (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <Card className="border-l-4 border-l-blue-500">
                                        <CardContent className="pt-6">
                                            <div className="space-y-3">
                                                <h3 className="font-semibold text-lg">
                                                    {selectedContestData.title}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {
                                                        selectedContestData.description
                                                    }
                                                </p>
                                                <div className="bg-muted/50 rounded-lg p-4">
                                                    <p className="font-medium mb-2">
                                                        作文要求：
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            selectedContestData.prompt
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <Badge variant="secondary">
                                                        <FileText className="w-3 h-3 mr-1" />
                                                        最多{" "}
                                                        {
                                                            selectedContestData.maxWords
                                                        }{" "}
                                                        字
                                                    </Badge>
                                                    <Badge variant="secondary">
                                                        <Award className="w-3 h-3 mr-1" />
                                                        奖励{" "}
                                                        {Number(
                                                            selectedContestData.reward
                                                        ) /
                                                            10 ** 18}{" "}
                                                        MON
                                                    </Badge>
                                                    <Badge variant="secondary">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {new Date(
                                                            selectedContestData.deadline
                                                        ).toLocaleDateString()}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Essay Form */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>创作您的作品</CardTitle>
                                        <CardDescription>
                                            请认真创作，AI将为您的作文进行专业评分
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <Label htmlFor="title">
                                                作文标题
                                            </Label>
                                            <Input
                                                id="title"
                                                placeholder="请输入作文标题"
                                                value={essayTitle}
                                                onChange={(e) =>
                                                    setEssayTitle(
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <Label htmlFor="content">
                                                    作文内容
                                                </Label>
                                                <div
                                                    className={`text-sm font-medium ${getWordCountColor()}`}
                                                >
                                                    {wordCount} / {maxWords} 字
                                                    {isOverLimit && (
                                                        <span className="ml-2">
                                                            <AlertTriangle className="w-4 h-4 inline" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Textarea
                                                id="content"
                                                placeholder="请输入您的作文内容..."
                                                value={essayContent}
                                                onChange={(e) =>
                                                    setEssayContent(
                                                        e.target.value
                                                    )
                                                }
                                                className="min-h-[400px] resize-none"
                                            />

                                            {/* Word Count Progress */}
                                            <div className="mt-3">
                                                <Progress
                                                    value={wordProgress}
                                                    className={`h-2 ${
                                                        isOverLimit
                                                            ? "[&>div]:bg-red-500"
                                                            : "[&>div]:bg-green-500"
                                                    }`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            {isGrading && (
                                                <div className="text-center py-6">
                                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                                                    <p className="text-sm text-muted-foreground">
                                                        AI正在评分中...
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* AI评分状态提示 */}
                                        {(isGrading || aiResult) && (
                                            <div
                                                className={`p-4 rounded-lg border ${
                                                    isGrading
                                                        ? "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                                                        : "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                                }`}
                                            >
                                                {isGrading ? (
                                                    <div className="flex items-center">
                                                        <Loader2 className="w-5 h-5 animate-spin mr-3 text-blue-500" />
                                                        <div>
                                                            <p className="font-medium text-blue-700 dark:text-blue-300">
                                                                AI正在评分中...
                                                            </p>
                                                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                                                请稍候，AI正在分析您的作文
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    aiResult && (
                                                        <div className="flex items-center">
                                                            <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                                                            <div>
                                                                <p className="font-medium text-green-700 dark:text-green-300">
                                                                    AI评分完成！得分：
                                                                    {
                                                                        aiResult.score
                                                                    }
                                                                    分
                                                                </p>
                                                                <p className="text-sm text-green-600 dark:text-green-400">
                                                                    详细反馈请查看右侧面板，点击提交按钮完成上链
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        <Button
                                            onClick={handleSubmit}
                                            disabled={
                                                !selectedContest ||
                                                !essayTitle.trim() ||
                                                !essayContent.trim() ||
                                                isSubmitting ||
                                                isOverLimit ||
                                                submitEssayMutation.isPending
                                            }
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                            size="lg"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    {isGrading
                                                        ? "AI评分中..."
                                                        : submitEssayMutation.isPending
                                                        ? "等待钱包确认..."
                                                        : aiResult
                                                        ? "准备上链提交..."
                                                        : "提交中..."}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    提交作文
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Writing Tips */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            写作建议
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="text-sm space-y-2">
                                            <p>
                                                •
                                                确保文章结构清晰，有明确的开头、正文和结尾
                                            </p>
                                            <p>• 使用生动的语言和具体的例子</p>
                                            <p>• 保持逻辑连贯，论证有力</p>
                                            <p>• 注意语法和拼写准确性</p>
                                            <p>
                                                •
                                                控制好文章长度，不要超出字数限制
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* AI Grading Status */}
                            {(isGrading || aiResult) && (
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Card
                                        className={
                                            aiResult && !isGrading
                                                ? "ring-2 ring-blue-500 ring-opacity-50"
                                                : ""
                                        }
                                    >
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Brain className="w-5 h-5 mr-2" />
                                                AI评分
                                                {aiResult && !isGrading && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-2 bg-green-100 text-green-700"
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        已完成
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {isGrading ? (
                                                <div className="text-center py-6">
                                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                                                    <p className="text-sm text-muted-foreground">
                                                        AI正在评分中...
                                                    </p>
                                                </div>
                                            ) : (
                                                aiResult && (
                                                    <div className="space-y-4">
                                                        <div className="text-center">
                                                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                                                {aiResult.score}
                                                                分
                                                            </div>
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-green-100 text-green-700"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                评分完成
                                                            </Badge>
                                                        </div>
                                                        <div className="bg-muted/50 rounded-lg p-4">
                                                            <p className="text-sm font-medium mb-2">
                                                                AI反馈：
                                                            </p>
                                                            <div className="text-sm text-muted-foreground prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
                                                                <ReactMarkdown
                                                                    components={{
                                                                        h1: (
                                                                            props
                                                                        ) => (
                                                                            <h1
                                                                                className="text-lg font-semibold mb-2"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                        h2: (
                                                                            props
                                                                        ) => (
                                                                            <h2
                                                                                className="text-base font-semibold mb-2"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                        h3: (
                                                                            props
                                                                        ) => (
                                                                            <h3
                                                                                className="text-sm font-semibold mb-1"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                        p: (
                                                                            props
                                                                        ) => (
                                                                            <p
                                                                                className="mb-2"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                        ul: (
                                                                            props
                                                                        ) => (
                                                                            <ul
                                                                                className="list-disc list-inside mb-2 space-y-1"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                        ol: (
                                                                            props
                                                                        ) => (
                                                                            <ol
                                                                                className="list-decimal list-inside mb-2 space-y-1"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                        li: (
                                                                            props
                                                                        ) => (
                                                                            <li
                                                                                className="text-sm"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                        strong: (
                                                                            props
                                                                        ) => (
                                                                            <strong
                                                                                className="font-semibold text-foreground"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                        em: (
                                                                            props
                                                                        ) => (
                                                                            <em
                                                                                className="italic"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                    }}
                                                                >
                                                                    {
                                                                        aiResult.feedback
                                                                    }
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Contest Stats */}
                            {selectedContestData && (
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>比赛统计</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    参与人数
                                                </span>
                                                <span className="font-medium">
                                                    {
                                                        selectedContestData.participantCount
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    奖励金额
                                                </span>
                                                <span className="font-medium text-orange-600">
                                                    {Number(
                                                        selectedContestData.reward
                                                    ) /
                                                        10 ** 18}{" "}
                                                    MON
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    截止时间
                                                </span>
                                                <span className="font-medium">
                                                    {new Date(
                                                        selectedContestData.deadline
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
