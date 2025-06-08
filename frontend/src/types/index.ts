export interface Contest {
    id: string;
    title: string;
    description: string;
    prompt: string;
    startTime: Date;
    endTime: Date;
    deadline: Date;
    maxWords: number;
    reward: string;
    status: "upcoming" | "active" | "ended";
    participantCount: number;
}

export interface Essay {
    id: string;
    contestId: string;
    authorAddress: string;
    authorName: string;
    title: string;
    content: string;
    submittedAt: Date;
    aiScore?: number;
    feedback?: string;
    status: "submitted" | "grading" | "graded";
}

export interface User {
    address: string;
    name: string;
    avatar?: string;
    joinedAt: Date;
    submissionsCount: number;
    averageScore: number;
    rank?: number;
}

export interface Ranking {
    essayId: string;
    contestId: string;
    authorAddress: string;
    authorName: string;
    score: number;
    rank: number;
    essayTitle: string;
}
