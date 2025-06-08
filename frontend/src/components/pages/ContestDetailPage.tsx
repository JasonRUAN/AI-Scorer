"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Trophy,
    Users,
    Calendar,
    Clock,
    Award,
    Target,
    FileText,
    ArrowLeft,
    Star,
    Medal,
    Crown,
} from "lucide-react";
import { mockContests, mockUsers, mockEssays } from "@/lib/mock-data";

interface ContestDetailPageProps {
    contestId: string;
}

export default function ContestDetailPage({
    contestId,
}: ContestDetailPageProps) {
    const contest = mockContests.find((c) => c.id === contestId);
    const [activeTab, setActiveTab] = useState("overview");

    if (!contest) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center">
                <div className="text-center">
                    <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">比赛不存在</h1>
                    <p className="text-muted-foreground mb-4">
                        抱歉，找不到您要查看的比赛
                    </p>
                    <Link href="/contests">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            返回比赛列表
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
            case "upcoming":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
            case "ended":
                return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "active":
                return "进行中";
            case "upcoming":
                return "即将开始";
            case "ended":
                return "已结束";
            default:
                return "未知";
        }
    };

    // Mock data for demonstration
    const submissions = mockEssays.filter(
        (essay) => essay.contestId === contestId
    );
    const topSubmissions = submissions
        .filter((essay) => essay.aiScore !== undefined)
        .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
        .slice(0, 10);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Link href="/contests">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            返回比赛列表
                        </Button>
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge
                                    variant="secondary"
                                    className={getStatusColor(contest.status)}
                                >
                                    <Clock className="w-3 h-3 mr-1" />
                                    {getStatusText(contest.status)}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200"
                                >
                                    <Award className="w-3 h-3 mr-1" />
                                    {contest.reward}
                                </Badge>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                {contest.title}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {contest.description}
                            </p>
                        </div>

                        {contest.status === "active" && (
                            <Link href="/submit">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Target className="w-5 h-5 mr-2" />
                                    参与比赛
                                </Button>
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                                {contest.participantCount}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                参与者
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                                {submissions.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                作品提交
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                                {Math.ceil(
                                    (new Date(contest.deadline).getTime() -
                                        new Date().getTime()) /
                                        (1000 * 60 * 60 * 24)
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                剩余天数
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Trophy className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold">
                                {contest.maxWords}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                字数上限
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">比赛详情</TabsTrigger>
                            <TabsTrigger value="leaderboard">
                                排行榜
                            </TabsTrigger>
                            <TabsTrigger value="submissions">
                                作品展示
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>比赛要求</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">
                                            作文主题：
                                        </h4>
                                        <p>{contest.prompt}</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                                            <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">
                                                字数要求
                                            </h4>
                                            <p className="text-blue-600 dark:text-blue-400">
                                                {contest.maxWords} 字以内
                                            </p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                                            <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">
                                                截止时间
                                            </h4>
                                            <p className="text-green-600 dark:text-green-400">
                                                {new Date(
                                                    contest.deadline
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>评分标准</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold">
                                                内容质量 (40%)
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                主题明确、观点清晰、论证有力、内容充实
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold">
                                                语言表达 (30%)
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                语言流畅、表达准确、词汇丰富、语法正确
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold">
                                                结构组织 (20%)
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                结构清晰、层次分明、逻辑连贯、首尾呼应
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold">
                                                创新性 (10%)
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                观点新颖、思路独特、表达方式有创意
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="leaderboard" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>当前排行榜</CardTitle>
                                    <CardDescription>
                                        根据AI评分排序的优秀作品
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topSubmissions.map(
                                            (submission, index) => {
                                                const author = mockUsers.find(
                                                    (u) =>
                                                        u.address ===
                                                        submission.authorAddress
                                                );
                                                return (
                                                    <div
                                                        key={submission.id}
                                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                                                                {index < 3 ? (
                                                                    index ===
                                                                    0 ? (
                                                                        <Crown className="w-4 h-4" />
                                                                    ) : index ===
                                                                      1 ? (
                                                                        <Medal className="w-4 h-4" />
                                                                    ) : (
                                                                        <Star className="w-4 h-4" />
                                                                    )
                                                                ) : (
                                                                    index + 1
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold">
                                                                    {
                                                                        submission.title
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    作者:{" "}
                                                                    {
                                                                        author?.name
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-blue-600">
                                                                {
                                                                    submission.aiScore
                                                                }{" "}
                                                                分
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {new Date(
                                                                    submission.submittedAt
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="submissions" className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {submissions.map((submission) => {
                                    const author = mockUsers.find(
                                        (u) =>
                                            u.address ===
                                            submission.authorAddress
                                    );
                                    return (
                                        <Card
                                            key={submission.id}
                                            className="hover:shadow-lg transition-all duration-300"
                                        >
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-lg">
                                                        {submission.title}
                                                    </CardTitle>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-blue-100 text-blue-700"
                                                    >
                                                        {submission.aiScore ||
                                                            "评分中"}{" "}
                                                        {submission.aiScore
                                                            ? "分"
                                                            : ""}
                                                    </Badge>
                                                </div>
                                                <CardDescription>
                                                    作者: {author?.name} •{" "}
                                                    {new Date(
                                                        submission.submittedAt
                                                    ).toLocaleDateString()}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm line-clamp-3 mb-4">
                                                    {submission.content}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    查看详情
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}
