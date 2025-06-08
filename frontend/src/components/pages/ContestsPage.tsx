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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Filter,
    Clock,
    Users,
    Calendar,
    Trophy,
    Target,
    Plus,
    Award,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { mockContests } from "@/lib/mock-data";
import { Contest } from "@/types";
import { toast } from "sonner";
import { useCreateContest } from "@/mutations/create_contest";

export default function ContestsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("deadline");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // 创建比赛的 mutation
    const createContestMutation = useCreateContest();

    // 创建比赛表单状态
    const [contestForm, setContestForm] = useState({
        title: "",
        description: "",
        prompt: "",
        maxWords: "",
        reward: "",
        startTime: "",
        endTime: "",
        deadline: "",
    });

    const handleCreateContest = async () => {
        try {
            // 验证表单
            if (
                !contestForm.title ||
                !contestForm.description ||
                !contestForm.prompt ||
                !contestForm.maxWords ||
                !contestForm.reward ||
                !contestForm.startTime ||
                !contestForm.endTime ||
                !contestForm.deadline
            ) {
                toast.error("请填写所有必填字段");
                return;
            }

            // 验证时间逻辑
            const startTime = new Date(contestForm.startTime).getTime();
            const endTime = new Date(contestForm.endTime).getTime();
            const deadline = new Date(contestForm.deadline).getTime();

            if (startTime >= endTime) {
                toast.error("比赛开始时间必须早于结束时间");
                return;
            }

            if (endTime > deadline) {
                toast.error("比赛结束时间不能晚于截止时间");
                return;
            }

            console.log(startTime, Date.now());

            if (startTime <= Date.now()) {
                toast.error("比赛开始时间必须晚于当前时间");
                return;
            }

            // 准备创建比赛的数据
            const contestInfo = {
                title: contestForm.title,
                description: contestForm.description,
                prompt: contestForm.prompt,
                startTime: Math.floor(startTime / 1000), // 转换为秒时间戳
                endTime: Math.floor(endTime / 1000), // 转换为秒时间戳
                deadline: Math.floor(deadline / 1000), // 转换为秒时间戳
                maxWords: parseInt(contestForm.maxWords),
                reward: parseFloat(contestForm.reward), // 以 ETH 为单位
            };

            // 调用创建比赛的 mutation
            await createContestMutation.mutateAsync(contestInfo);

            toast.success("比赛创建成功！");
            setIsCreateDialogOpen(false);

            // 重置表单
            setContestForm({
                title: "",
                description: "",
                prompt: "",
                maxWords: "",
                reward: "",
                startTime: "",
                endTime: "",
                deadline: "",
            });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "创建比赛失败，请重试";
            toast.error(errorMessage);
        }
    };

    const filteredContests = mockContests.filter((contest) => {
        const matchesSearch =
            contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contest.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || contest.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const sortedContests = [...filteredContests].sort((a, b) => {
        switch (sortBy) {
            case "deadline":
                return (
                    new Date(a.deadline).getTime() -
                    new Date(b.deadline).getTime()
                );
            case "reward":
                return (
                    parseInt(b.reward.split(" ")[0]) -
                    parseInt(a.reward.split(" ")[0])
                );
            case "participants":
                return b.participantCount - a.participantCount;
            default:
                return 0;
        }
    });

    const getStatusIcon = (status: Contest["status"]) => {
        switch (status) {
            case "active":
                return <Clock className="w-3 h-3" />;
            case "upcoming":
                return <AlertCircle className="w-3 h-3" />;
            case "ended":
                return <CheckCircle className="w-3 h-3" />;
        }
    };

    const getStatusColor = (status: Contest["status"]) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
            case "upcoming":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
            case "ended":
                return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    const getStatusText = (status: Contest["status"]) => {
        switch (status) {
            case "active":
                return "进行中";
            case "upcoming":
                return "即将开始";
            case "ended":
                return "已结束";
        }
    };

    const activeContests = mockContests.filter((c) => c.status === "active");
    const upcomingContests = mockContests.filter(
        (c) => c.status === "upcoming"
    );
    const endedContests = mockContests.filter((c) => c.status === "ended");

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
                        作文比赛
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        发挥您的创作才能，参与我们的AI评分比赛，赢取丰厚奖励
                    </p>

                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                <Plus className="w-4 h-4 mr-2" />
                                创建比赛
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>创建新比赛</DialogTitle>
                                <DialogDescription>
                                    填写比赛信息，创建一个新的作文比赛
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">比赛标题 *</Label>
                                    <Input
                                        id="title"
                                        value={contestForm.title}
                                        onChange={(e) =>
                                            setContestForm({
                                                ...contestForm,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="请输入比赛标题"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        比赛描述 *
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={contestForm.description}
                                        onChange={(e) =>
                                            setContestForm({
                                                ...contestForm,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="请输入比赛描述"
                                        className="min-h-[80px]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="prompt">作文主题 *</Label>
                                    <Textarea
                                        id="prompt"
                                        value={contestForm.prompt}
                                        onChange={(e) =>
                                            setContestForm({
                                                ...contestForm,
                                                prompt: e.target.value,
                                            })
                                        }
                                        placeholder="请输入详细的作文题目和要求"
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="startTime">
                                        开始时间 *
                                    </Label>
                                    <Input
                                        id="startTime"
                                        type="datetime-local"
                                        value={contestForm.startTime}
                                        onChange={(e) =>
                                            setContestForm({
                                                ...contestForm,
                                                startTime: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="endTime">结束时间 *</Label>
                                    <Input
                                        id="endTime"
                                        type="datetime-local"
                                        value={contestForm.endTime}
                                        onChange={(e) =>
                                            setContestForm({
                                                ...contestForm,
                                                endTime: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="maxWords">
                                            字数限制 *
                                        </Label>
                                        <Input
                                            id="maxWords"
                                            type="number"
                                            value={contestForm.maxWords}
                                            onChange={(e) =>
                                                setContestForm({
                                                    ...contestForm,
                                                    maxWords: e.target.value,
                                                })
                                            }
                                            placeholder="1000"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="reward">
                                            奖励金额 (MON) *
                                        </Label>
                                        <Input
                                            id="reward"
                                            type="number"
                                            step="0.01"
                                            value={contestForm.reward}
                                            onChange={(e) =>
                                                setContestForm({
                                                    ...contestForm,
                                                    reward: e.target.value,
                                                })
                                            }
                                            placeholder="1.0"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="deadline">截止时间 *</Label>
                                    <Input
                                        id="deadline"
                                        type="datetime-local"
                                        value={contestForm.deadline}
                                        onChange={(e) =>
                                            setContestForm({
                                                ...contestForm,
                                                deadline: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                    disabled={createContestMutation.isPending}
                                >
                                    取消
                                </Button>
                                <Button
                                    onClick={handleCreateContest}
                                    disabled={createContestMutation.isPending}
                                >
                                    {createContestMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            创建中...
                                        </>
                                    ) : (
                                        "创建比赛"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    className="mb-8 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="搜索比赛..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="deadline">
                                        截止时间
                                    </SelectItem>
                                    <SelectItem value="reward">
                                        奖励金额
                                    </SelectItem>
                                    <SelectItem value="participants">
                                        参与人数
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        全部状态
                                    </SelectItem>
                                    <SelectItem value="active">
                                        进行中
                                    </SelectItem>
                                    <SelectItem value="upcoming">
                                        即将开始
                                    </SelectItem>
                                    <SelectItem value="ended">
                                        已结束
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Tabs defaultValue="all" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">
                                全部 ({mockContests.length})
                            </TabsTrigger>
                            <TabsTrigger value="active">
                                进行中 ({activeContests.length})
                            </TabsTrigger>
                            <TabsTrigger value="upcoming">
                                即将开始 ({upcomingContests.length})
                            </TabsTrigger>
                            <TabsTrigger value="ended">
                                已结束 ({endedContests.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <ContestGrid contests={sortedContests} />
                        </TabsContent>

                        <TabsContent value="active">
                            <ContestGrid contests={activeContests} />
                        </TabsContent>

                        <TabsContent value="upcoming">
                            <ContestGrid contests={upcomingContests} />
                        </TabsContent>

                        <TabsContent value="ended">
                            <ContestGrid contests={endedContests} />
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );

    function ContestGrid({ contests }: { contests: Contest[] }) {
        if (contests.length === 0) {
            return (
                <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">暂无比赛</h3>
                    <p className="text-muted-foreground">请稍后再来查看</p>
                </div>
            );
        }

        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((contest, index) => (
                    <motion.div
                        key={contest.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/30">
                            <CardHeader className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <Badge
                                        variant="secondary"
                                        className={getStatusColor(
                                            contest.status
                                        )}
                                    >
                                        {getStatusIcon(contest.status)}
                                        <span className="ml-1">
                                            {getStatusText(contest.status)}
                                        </span>
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200"
                                    >
                                        <Award className="w-3 h-3 mr-1" />
                                        {contest.reward}
                                    </Badge>
                                </div>

                                <div>
                                    <CardTitle className="text-xl leading-tight mb-2">
                                        {contest.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3 text-base">
                                        {contest.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        <span>
                                            {contest.participantCount} 参与者
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>
                                            {new Date(
                                                contest.deadline
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-muted/50 rounded-lg p-3">
                                    <div className="text-sm text-muted-foreground mb-1">
                                        字数要求
                                    </div>
                                    <div className="font-medium">
                                        {contest.maxWords} 字以内
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Link href={`/contests/${contest.id}`}>
                                        <Button
                                            className="w-full"
                                            variant={
                                                contest.status === "active"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            disabled={
                                                contest.status === "ended"
                                            }
                                        >
                                            <Target className="w-4 h-4 mr-2" />
                                            {contest.status === "active"
                                                ? "参与比赛"
                                                : contest.status === "upcoming"
                                                ? "查看详情"
                                                : "查看结果"}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        );
    }
}
