"use client";

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
import { Progress } from "@/components/ui/progress";
import {
    Brain,
    Trophy,
    Users,
    Zap,
    Clock,
    Award,
    TrendingUp,
    Sparkles,
    ChevronRight,
    Calendar,
    Target,
} from "lucide-react";
import { mockContests } from "@/lib/mock-data";
import { getContestStatus } from "@/lib/contest-utils";
import { useGetAllContests } from "@/hooks/useGetAllContests";

export default function HomePage() {
    // 获取真实比赛数据
    const { data: contests = [] } = useGetAllContests();

    // 如果没有真实数据，使用模拟数据作为后备
    const contestsToUse = contests.length > 0 ? contests : mockContests;

    const activeContests = contestsToUse.filter(
        (contest) => getContestStatus(contest) === "active"
    );
    const stats = [
        {
            label: "活跃用户",
            value: "XXX",
            icon: Users,
            color: "from-blue-500 to-cyan-500",
        },
        {
            label: "已评分作文",
            value: "XXX",
            icon: Brain,
            color: "from-purple-500 to-pink-500",
        },
        {
            label: "进行中比赛",
            value: activeContests.length.toString(),
            icon: Trophy,
            color: "from-green-500 to-emerald-500",
        },
        {
            label: "奖励发放",
            value: "XXX MON",
            icon: Award,
            color: "from-orange-500 to-red-500",
        },
    ];

    const features = [
        {
            title: "AI智能评分",
            description: "采用先进的AI技术，提供公正准确的作文评分服务",
            icon: Brain,
            color: "from-blue-500 to-purple-600",
        },
        {
            title: "区块链激励",
            description: "基于区块链技术的透明奖励机制，激发创作热情",
            icon: Zap,
            color: "from-green-500 to-blue-600",
        },
        {
            title: "实时排行",
            description: "实时更新的排行榜系统，展示优秀作品和作者",
            icon: TrendingUp,
            color: "from-purple-500 to-pink-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                                AI驱动的
                                <br />
                                作文评分平台
                            </h1>
                            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                                结合人工智能与区块链技术，为您提供公正、透明、激励性的作文评分体验。
                                让每一篇作文都能得到专业的评价和应有的奖励。
                            </p>
                        </motion.div>

                        <motion.div
                            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Link href="/submit">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    开始创作
                                </Button>
                            </Link>
                            <Link href="/contests">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-8 py-3"
                                >
                                    <Trophy className="w-5 h-5 mr-2" />
                                    查看比赛
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-background/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <Card className="text-center border-0 bg-gradient-to-br from-background to-muted/50">
                                    <CardContent className="pt-6">
                                        <div
                                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-4`}
                                        >
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {stat.label}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            平台特色
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            我们致力于打造最专业、最公正、最激励人心的作文评分平台
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/30">
                                    <CardHeader>
                                        <div
                                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                                        >
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base leading-relaxed">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Active Contests Section */}
            <section className="py-20 bg-background/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="flex justify-between items-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                活跃比赛
                            </h2>
                            <p className="text-muted-foreground">
                                参与正在进行的作文比赛，展示您的才华
                            </p>
                        </div>
                        <Link href="/contests">
                            <Button variant="outline">
                                查看全部
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeContests.map((contest, index) => (
                            <motion.div
                                key={contest.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.1,
                                }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                            >
                                                <Clock className="w-3 h-3 mr-1" />
                                                进行中
                                            </Badge>
                                            <Badge variant="outline">
                                                {Number(contest.reward) /
                                                    10 ** 18}{" "}
                                                MON
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl leading-tight">
                                            {contest.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {contest.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {contest.participantCount}{" "}
                                                参与者
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(
                                                    contest.deadline
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>进度</span>
                                                <span>75%</span>
                                            </div>
                                            <Progress
                                                value={75}
                                                className="h-2"
                                            />
                                        </div>

                                        <Link href={`/contests/${contest.id}`}>
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                            >
                                                <Target className="w-4 h-4 mr-2" />
                                                参与比赛
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            准备好展示您的才华了吗？
                        </h2>
                        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                            加入我们的AI作文评分平台，让您的每一篇作品都能得到专业的评价和丰厚的奖励。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/submit">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="px-8 py-3"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    立即开始创作
                                </Button>
                            </Link>
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
                            >
                                了解更多
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
