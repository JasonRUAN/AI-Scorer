"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Trophy,
    Medal,
    Award,
    Star,
    TrendingUp,
    Crown,
    Brain,
    Target,
    Users,
    Calendar,
} from "lucide-react";
import { mockContests, mockRankings } from "@/lib/mock-data";

export default function LeaderboardPage() {
    const [selectedContest, setSelectedContest] = useState("all");

    const filteredRankings =
        selectedContest === "all"
            ? mockRankings
            : mockRankings.filter((r) => r.contestId === selectedContest);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-5 h-5 text-yellow-500" />;
            case 2:
                return <Medal className="w-5 h-5 text-gray-400" />;
            case 3:
                return <Award className="w-5 h-5 text-amber-600" />;
            default:
                return (
                    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
                        #{rank}
                    </span>
                );
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-yellow-400 to-yellow-600";
            case 2:
                return "bg-gradient-to-r from-gray-300 to-gray-500";
            case 3:
                return "bg-gradient-to-r from-amber-400 to-amber-600";
            default:
                return "bg-gradient-to-r from-blue-400 to-blue-600";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600";
        if (score >= 80) return "text-blue-600";
        if (score >= 70) return "text-orange-600";
        return "text-red-600";
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
                        排行榜
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        查看各项比赛的排名和优秀作品，向优秀作者学习
                    </p>
                </motion.div>

                {/* Contest Filter */}
                <motion.div
                    className="mb-8 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Select
                        value={selectedContest}
                        onValueChange={setSelectedContest}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">所有比赛</SelectItem>
                            {mockContests.map((contest) => (
                                <SelectItem key={contest.id} value={contest.id}>
                                    {contest.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Leaderboard */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Trophy className="w-5 h-5 mr-2" />
                                        作文排行榜
                                    </CardTitle>
                                    <CardDescription>
                                        基于AI评分的作文质量排名
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filteredRankings.map(
                                            (ranking, index) => (
                                                <motion.div
                                                    key={ranking.essayId}
                                                    className="flex items-center p-4 rounded-lg border bg-gradient-to-r from-background to-muted/30 hover:shadow-md transition-all duration-300"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1,
                                                    }}
                                                >
                                                    {/* Rank */}
                                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mr-4">
                                                        {getRankIcon(
                                                            ranking.rank
                                                        )}
                                                    </div>

                                                    {/* Author Info */}
                                                    <div className="flex items-center flex-1">
                                                        <Avatar className="w-10 h-10 mr-3">
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ranking.authorName}`}
                                                            />
                                                            <AvatarFallback>
                                                                {
                                                                    ranking
                                                                        .authorName[0]
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="font-semibold">
                                                                {
                                                                    ranking.authorName
                                                                }
                                                            </div>
                                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                                {
                                                                    ranking.essayTitle
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Score */}
                                                    <div className="text-right">
                                                        <div
                                                            className={`text-2xl font-bold ${getScoreColor(
                                                                ranking.score
                                                            )}`}
                                                        >
                                                            {ranking.score}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            分
                                                        </div>
                                                    </div>

                                                    {/* Prize Indicator */}
                                                    {ranking.rank <= 3 && (
                                                        <div className="ml-4">
                                                            <Badge
                                                                className={`${getRankColor(
                                                                    ranking.rank
                                                                )} text-white border-0`}
                                                            >
                                                                {ranking.rank ===
                                                                1
                                                                    ? "冠军"
                                                                    : ranking.rank ===
                                                                      2
                                                                    ? "亚军"
                                                                    : "季军"}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Top 3 Podium */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Crown className="w-5 h-5 mr-2" />
                                        领奖台
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filteredRankings
                                            .slice(0, 3)
                                            .map((ranking, index) => (
                                                <div
                                                    key={ranking.essayId}
                                                    className={`relative p-4 rounded-lg ${
                                                        ranking.rank === 1
                                                            ? "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
                                                            : ranking.rank === 2
                                                            ? "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
                                                            : "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
                                                    }`}
                                                >
                                                    <div className="flex items-center">
                                                        <div className="mr-3">
                                                            {getRankIcon(
                                                                ranking.rank
                                                            )}
                                                        </div>
                                                        <Avatar className="w-8 h-8 mr-3">
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ranking.authorName}`}
                                                            />
                                                            <AvatarFallback>
                                                                {
                                                                    ranking
                                                                        .authorName[0]
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm">
                                                                {
                                                                    ranking.authorName
                                                                }
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {ranking.score}
                                                                分
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Contest Info */}
                        {selectedContest !== "all" && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Target className="w-5 h-5 mr-2" />
                                            比赛信息
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {(() => {
                                            const contest = mockContests.find(
                                                (c) => c.id === selectedContest
                                            );
                                            if (!contest) return null;

                                            return (
                                                <div className="space-y-3">
                                                    <h3 className="font-semibold">
                                                        {contest.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {contest.description}
                                                    </p>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground">
                                                                参与人数
                                                            </span>
                                                            <div className="flex items-center">
                                                                <Users className="w-3 h-3 mr-1" />
                                                                {
                                                                    contest.participantCount
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground">
                                                                奖励金额
                                                            </span>
                                                            <Badge variant="outline">
                                                                {contest.reward}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground">
                                                                截止时间
                                                            </span>
                                                            <div className="flex items-center">
                                                                <Calendar className="w-3 h-3 mr-1" />
                                                                {new Date(
                                                                    contest.deadline
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2" />
                                        统计数据
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            平均分
                                        </span>
                                        <span className="font-semibold">
                                            {(
                                                filteredRankings.reduce(
                                                    (sum, r) => sum + r.score,
                                                    0
                                                ) / filteredRankings.length
                                            ).toFixed(1)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            最高分
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            {Math.max(
                                                ...filteredRankings.map(
                                                    (r) => r.score
                                                )
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            参与作者
                                        </span>
                                        <span className="font-semibold">
                                            {
                                                new Set(
                                                    filteredRankings.map(
                                                        (r) => r.authorAddress
                                                    )
                                                ).size
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            作品总数
                                        </span>
                                        <span className="font-semibold">
                                            {filteredRankings.length}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Achievement */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <Star className="w-12 h-12 mx-auto mb-4" />
                                        <h3 className="font-semibold mb-2">
                                            参与挑战
                                        </h3>
                                        <p className="text-sm opacity-90 mb-4">
                                            提交您的作品，争夺排行榜榜首位置
                                        </p>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="bg-white text-blue-600 hover:bg-gray-100"
                                        >
                                            <Brain className="w-4 h-4 mr-2" />
                                            开始创作
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
