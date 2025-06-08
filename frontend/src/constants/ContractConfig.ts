export const aiScorerContractConfig = {
    address: "0x383bedCBA3f9BdDB7C5c8f4CE0346AE4e0bB9923",
    abi: [
        { type: "constructor", inputs: [], stateMutability: "nonpayable" },
        {
            type: "function",
            name: "activeContestIds",
            inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "allContestIds",
            inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "authorizeScorer",
            inputs: [
                { name: "_scorer", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "authorizedScorers",
            inputs: [{ name: "", type: "address", internalType: "address" }],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "contestEssays",
            inputs: [
                { name: "", type: "uint256", internalType: "uint256" },
                { name: "", type: "uint256", internalType: "uint256" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "contestWinners",
            inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "contests",
            inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            outputs: [
                { name: "id", type: "uint256", internalType: "uint256" },
                { name: "title", type: "string", internalType: "string" },
                { name: "description", type: "string", internalType: "string" },
                { name: "prompt", type: "string", internalType: "string" },
                { name: "startTime", type: "uint256", internalType: "uint256" },
                { name: "endTime", type: "uint256", internalType: "uint256" },
                { name: "deadline", type: "uint256", internalType: "uint256" },
                { name: "maxWords", type: "uint256", internalType: "uint256" },
                { name: "reward", type: "uint256", internalType: "uint256" },
                {
                    name: "status",
                    type: "uint8",
                    internalType: "enum AIScorer.ContestStatus",
                },
                {
                    name: "participantCount",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "rewardDistributed",
                    type: "bool",
                    internalType: "bool",
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "createContest",
            inputs: [
                { name: "_title", type: "string", internalType: "string" },
                {
                    name: "_description",
                    type: "string",
                    internalType: "string",
                },
                { name: "_prompt", type: "string", internalType: "string" },
                {
                    name: "_startTime",
                    type: "uint256",
                    internalType: "uint256",
                },
                { name: "_endTime", type: "uint256", internalType: "uint256" },
                { name: "_deadline", type: "uint256", internalType: "uint256" },
                { name: "_maxWords", type: "uint256", internalType: "uint256" },
            ],
            outputs: [],
            stateMutability: "payable",
        },
        {
            type: "function",
            name: "endContest",
            inputs: [
                {
                    name: "_contestId",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "essays",
            inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            outputs: [
                { name: "id", type: "uint256", internalType: "uint256" },
                { name: "contestId", type: "uint256", internalType: "uint256" },
                { name: "author", type: "address", internalType: "address" },
                { name: "title", type: "string", internalType: "string" },
                { name: "contentHash", type: "string", internalType: "string" },
                {
                    name: "submittedAt",
                    type: "uint256",
                    internalType: "uint256",
                },
                { name: "aiScore", type: "uint256", internalType: "uint256" },
                { name: "feedback", type: "string", internalType: "string" },
                {
                    name: "status",
                    type: "uint8",
                    internalType: "enum AIScorer.EssayStatus",
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getActiveContests",
            inputs: [],
            outputs: [
                { name: "", type: "uint256[]", internalType: "uint256[]" },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getAllContests",
            inputs: [],
            outputs: [
                { name: "", type: "uint256[]", internalType: "uint256[]" },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getContest",
            inputs: [
                {
                    name: "_contestId",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [
                {
                    name: "",
                    type: "tuple",
                    internalType: "struct AIScorer.Contest",
                    components: [
                        {
                            name: "id",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "title",
                            type: "string",
                            internalType: "string",
                        },
                        {
                            name: "description",
                            type: "string",
                            internalType: "string",
                        },
                        {
                            name: "prompt",
                            type: "string",
                            internalType: "string",
                        },
                        {
                            name: "startTime",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "endTime",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "deadline",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "maxWords",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "reward",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "status",
                            type: "uint8",
                            internalType: "enum AIScorer.ContestStatus",
                        },
                        {
                            name: "participantCount",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "participants",
                            type: "address[]",
                            internalType: "address[]",
                        },
                        {
                            name: "rewardDistributed",
                            type: "bool",
                            internalType: "bool",
                        },
                    ],
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getContestEssays",
            inputs: [
                {
                    name: "_contestId",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [
                { name: "", type: "uint256[]", internalType: "uint256[]" },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getContestLeaderboard",
            inputs: [
                {
                    name: "_contestId",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [
                {
                    name: "authors",
                    type: "address[]",
                    internalType: "address[]",
                },
                {
                    name: "scores",
                    type: "uint256[]",
                    internalType: "uint256[]",
                },
                {
                    name: "essayTitles",
                    type: "string[]",
                    internalType: "string[]",
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getEssay",
            inputs: [
                { name: "_essayId", type: "uint256", internalType: "uint256" },
            ],
            outputs: [
                {
                    name: "",
                    type: "tuple",
                    internalType: "struct AIScorer.Essay",
                    components: [
                        {
                            name: "id",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "contestId",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "author",
                            type: "address",
                            internalType: "address",
                        },
                        {
                            name: "title",
                            type: "string",
                            internalType: "string",
                        },
                        {
                            name: "contentHash",
                            type: "string",
                            internalType: "string",
                        },
                        {
                            name: "submittedAt",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "aiScore",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "feedback",
                            type: "string",
                            internalType: "string",
                        },
                        {
                            name: "status",
                            type: "uint8",
                            internalType: "enum AIScorer.EssayStatus",
                        },
                    ],
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getUserProfile",
            inputs: [
                { name: "_user", type: "address", internalType: "address" },
            ],
            outputs: [
                {
                    name: "",
                    type: "tuple",
                    internalType: "struct AIScorer.UserProfile",
                    components: [
                        {
                            name: "name",
                            type: "string",
                            internalType: "string",
                        },
                        {
                            name: "submissionsCount",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "totalScore",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "contestsWon",
                            type: "uint256",
                            internalType: "uint256",
                        },
                        {
                            name: "essayIds",
                            type: "uint256[]",
                            internalType: "uint256[]",
                        },
                    ],
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "nextContestId",
            inputs: [],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "nextEssayId",
            inputs: [],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "owner",
            inputs: [],
            outputs: [{ name: "", type: "address", internalType: "address" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "renounceOwnership",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "revokeScorer",
            inputs: [
                { name: "_scorer", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "scoreEssay",
            inputs: [
                { name: "_essayId", type: "uint256", internalType: "uint256" },
                { name: "_score", type: "uint256", internalType: "uint256" },
                { name: "_feedback", type: "string", internalType: "string" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "submitEssay",
            inputs: [
                {
                    name: "_contestId",
                    type: "uint256",
                    internalType: "uint256",
                },
                { name: "_title", type: "string", internalType: "string" },
                {
                    name: "_contentHash",
                    type: "string",
                    internalType: "string",
                },
                { name: "_score", type: "uint256", internalType: "uint256" },
                { name: "_feedback", type: "string", internalType: "string" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "transferOwnership",
            inputs: [
                { name: "newOwner", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "updateUserProfile",
            inputs: [{ name: "_name", type: "string", internalType: "string" }],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "userProfiles",
            inputs: [{ name: "", type: "address", internalType: "address" }],
            outputs: [
                { name: "name", type: "string", internalType: "string" },
                {
                    name: "submissionsCount",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "totalScore",
                    type: "uint256",
                    internalType: "uint256",
                },
                {
                    name: "contestsWon",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            stateMutability: "view",
        },
        {
            type: "event",
            name: "ContestCreated",
            inputs: [
                {
                    name: "contestId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "title",
                    type: "string",
                    indexed: false,
                    internalType: "string",
                },
                {
                    name: "endTime",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
                {
                    name: "reward",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "ContestEnded",
            inputs: [
                {
                    name: "contestId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "EssayScored",
            inputs: [
                {
                    name: "contestId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "essayId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "score",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "EssaySubmitted",
            inputs: [
                {
                    name: "contestId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "essayId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "author",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
                {
                    name: "previousOwner",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "newOwner",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "RewardDistributed",
            inputs: [
                {
                    name: "contestId",
                    type: "uint256",
                    indexed: true,
                    internalType: "uint256",
                },
                {
                    name: "winner",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "reward",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
            ],
            anonymous: false,
        },
        {
            type: "error",
            name: "OwnableInvalidOwner",
            inputs: [
                { name: "owner", type: "address", internalType: "address" },
            ],
        },
        {
            type: "error",
            name: "OwnableUnauthorizedAccount",
            inputs: [
                { name: "account", type: "address", internalType: "address" },
            ],
        },
    ],
};
