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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Trophy,
    Brain,
    Calendar,
    FileText,
    Award,
    TrendingUp,
    Star,
    Target,
    Edit,
} from "lucide-react";
import { mockUsers, mockEssays } from "@/lib/mock-data";

export default function ProfilePage() {
    const [user] = useState(mockUsers[0]); // Mock current user
    const userEssays = mockEssays.filter(
        (essay) => essay.authorAddress === user.address
    );

    const totalSubmissions = userEssays.length;
    // const averageScore =
    //     userEssays.reduce((sum, essay) => sum + (essay.aiScore || 0), 0) /
    //     totalSubmissions;
    const highestScore = Math.max(
        ...userEssays.map((essay) => essay.aiScore || 0)
    );

    const achievements = [
        {
            id: 1,
            title: "首次提交",
            description: "完成第一次作文提交",
            icon: FileText,
            earned: totalSubmissions > 0,
            progress: totalSubmissions > 0 ? 100 : 0,
        },
        {
            id: 2,
            title: "连续创作者",
            description: "连续3天提交作品",
            icon: Calendar,
            earned: false,
            progress: 33,
        },
        {
            id: 3,
            title: "高分获得者",
            description: "获得90分以上评分",
            icon: Star,
            earned: highestScore >= 90,
            progress: highestScore >= 90 ? 100 : (highestScore / 90) * 100,
        },
        {
            id: 4,
            title: "多产作家",
            description: "提交10篇以上作品",
            icon: Edit,
            earned: totalSubmissions >= 10,
            progress: (totalSubmissions / 10) * 100,
        },
    ];

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
                        个人中心
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        查看您的创作历程和成就
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="mb-6">
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <Avatar className="w-24 h-24 mx-auto mb-4">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback className="text-2xl">
                                                {user.name[0]}
                                            </AvatarFallback>
                                        </Avatar>

                                        <h2 className="text-2xl font-bold mb-2">
                                            {user.name}
                                        </h2>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            {user.address.slice(0, 6)}...
                                            {user.address.slice(-4)}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {user.rank}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    排名
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {user.averageScore.toFixed(
                                                        1
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    平均分
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full mt-6"
                                            variant="outline"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            编辑资料
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Stats Cards */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">
                                                    {totalSubmissions}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    提交作品
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                                                <Star className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">
                                                    {highestScore}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    最高分
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                                                <Trophy className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">
                                                    {
                                                        achievements.filter(
                                                            (a) => a.earned
                                                        ).length
                                                    }
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    成就解锁
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Tabs defaultValue="essays" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="essays">
                                        我的作品
                                    </TabsTrigger>
                                    <TabsTrigger value="achievements">
                                        成就系统
                                    </TabsTrigger>
                                    <TabsTrigger value="analytics">
                                        数据分析
                                    </TabsTrigger>
                                </TabsList>

                                {/* Essays Tab */}
                                <TabsContent value="essays">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <FileText className="w-5 h-5 mr-2" />
                                                我的作品
                                            </CardTitle>
                                            <CardDescription>
                                                查看您提交的所有作文和评分情况
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {userEssays.map(
                                                    (essay, index) => (
                                                        <motion.div
                                                            key={essay.id}
                                                            className="p-4 border rounded-lg bg-gradient-to-r from-background to-muted/30 hover:shadow-md transition-all duration-300"
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
                                                                delay:
                                                                    index * 0.1,
                                                            }}
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex-1">
                                                                    <h3 className="font-semibold text-lg mb-1">
                                                                        {
                                                                            essay.title
                                                                        }
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                                        {essay.content.slice(
                                                                            0,
                                                                            100
                                                                        )}
                                                                        ...
                                                                    </p>
                                                                </div>
                                                                <div className="text-right ml-4">
                                                                    {essay.aiScore && (
                                                                        <div className="text-2xl font-bold text-blue-600">
                                                                            {
                                                                                essay.aiScore
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {essay.aiScore
                                                                            ? "分"
                                                                            : "评分中"}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                    <div className="flex items-center">
                                                                        <Calendar className="w-3 h-3 mr-1" />
                                                                        {new Date(
                                                                            essay.submittedAt
                                                                        ).toLocaleDateString()}
                                                                    </div>
                                                                    <Badge
                                                                        variant={
                                                                            essay.status ===
                                                                            "graded"
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {essay.status ===
                                                                        "graded"
                                                                            ? "已评分"
                                                                            : "评分中"}
                                                                    </Badge>
                                                                </div>

                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    查看详情
                                                                </Button>
                                                            </div>

                                                            {essay.feedback && (
                                                                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                                                    <p className="text-sm">
                                                                        {
                                                                            essay.feedback
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    )
                                                )}

                                                {userEssays.length === 0 && (
                                                    <div className="text-center py-12">
                                                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                                        <h3 className="text-lg font-semibold mb-2">
                                                            还没有作品
                                                        </h3>
                                                        <p className="text-muted-foreground mb-4">
                                                            快去参加比赛，提交您的第一篇作文吧！
                                                        </p>
                                                        <Button>
                                                            <Target className="w-4 h-4 mr-2" />
                                                            开始创作
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Achievements Tab */}
                                <TabsContent value="achievements">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Award className="w-5 h-5 mr-2" />
                                                成就系统
                                            </CardTitle>
                                            <CardDescription>
                                                解锁各种成就，展示您的创作实力
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {achievements.map(
                                                    (achievement, index) => (
                                                        <motion.div
                                                            key={achievement.id}
                                                            className={`p-4 border rounded-lg transition-all duration-300 ${
                                                                achievement.earned
                                                                    ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200"
                                                                    : "bg-gradient-to-r from-background to-muted/30"
                                                            }`}
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.9,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay:
                                                                    index * 0.1,
                                                            }}
                                                        >
                                                            <div className="flex items-center mb-3">
                                                                <div
                                                                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                                                        achievement.earned
                                                                            ? "bg-green-100 dark:bg-green-900"
                                                                            : "bg-muted"
                                                                    }`}
                                                                >
                                                                    <achievement.icon
                                                                        className={`w-5 h-5 ${
                                                                            achievement.earned
                                                                                ? "text-green-600"
                                                                                : "text-muted-foreground"
                                                                        }`}
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h3 className="font-semibold">
                                                                        {
                                                                            achievement.title
                                                                        }
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            achievement.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                                {achievement.earned && (
                                                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                                                        已解锁
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-sm">
                                                                    <span>
                                                                        进度
                                                                    </span>
                                                                    <span>
                                                                        {Math.round(
                                                                            achievement.progress
                                                                        )}
                                                                        %
                                                                    </span>
                                                                </div>
                                                                <Progress
                                                                    value={
                                                                        achievement.progress
                                                                    }
                                                                    className="h-2"
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Analytics Tab */}
                                <TabsContent value="analytics">
                                    <div className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center">
                                                    <TrendingUp className="w-5 h-5 mr-2" />
                                                    分数趋势
                                                </CardTitle>
                                                <CardDescription>
                                                    您的作文评分变化趋势
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                                                    <div className="text-center">
                                                        <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                                        <p className="text-muted-foreground">
                                                            分数趋势图表
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            功能开发中...
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">
                                                        写作习惯
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            平均字数
                                                        </span>
                                                        <span className="font-medium">
                                                            850字
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            最佳发挥时间
                                                        </span>
                                                        <span className="font-medium">
                                                            晚上 8-10点
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            常用主题
                                                        </span>
                                                        <span className="font-medium">
                                                            科技、环保
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">
                                                        改进建议
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="text-sm space-y-2">
                                                        <p>
                                                            •
                                                            增加具体实例来支撑观点
                                                        </p>
                                                        <p>
                                                            •
                                                            注意段落间的逻辑连接
                                                        </p>
                                                        <p>
                                                            •
                                                            适当使用修辞手法增强表达力
                                                        </p>
                                                        <p>
                                                            • 保持语言简洁明了
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
