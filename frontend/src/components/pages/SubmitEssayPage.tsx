"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { mockContests, mockAIScore } from "@/lib/mock-data";
import { getContestStatus } from "@/lib/contest-utils";
import { useGetAllContests } from "@/hooks/useGetAllContests";

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
            // Mock submission
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success("作文提交成功！");

            // Start AI grading
            setIsGrading(true);
            const result = await mockAIScore(essayContent);
            setAiResult(result);
            setIsGrading(false);

            toast.success(`AI评分完成！得分：${result.score}分`);
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
                                                                    {
                                                                        contest.reward
                                                                    }
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
                                                        {
                                                            selectedContestData.reward
                                                        }
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

                                        <Button
                                            onClick={handleSubmit}
                                            disabled={
                                                !selectedContest ||
                                                !essayTitle.trim() ||
                                                !essayContent.trim() ||
                                                isSubmitting ||
                                                isOverLimit
                                            }
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                            size="lg"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    提交中...
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
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Brain className="w-5 h-5 mr-2" />
                                                AI评分
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
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    aiResult.feedback
                                                                }
                                                            </p>
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
                                                    {selectedContestData.reward}
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
