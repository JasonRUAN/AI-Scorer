// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIScorer is Ownable, ReentrancyGuard {
    // 事件定义
    event ContestCreated(uint256 indexed contestId, string title, uint256 endTime, uint256 reward);
    event EssaySubmitted(uint256 indexed contestId, uint256 indexed essayId, address indexed author);
    event EssayScored(uint256 indexed contestId, uint256 indexed essayId, uint256 score);
    event RewardDistributed(uint256 indexed contestId, address indexed winner, uint256 reward);
    event ContestEnded(uint256 indexed contestId);

    // 结构体定义
    struct Contest {
        uint256 id;
        string title;
        string description;
        string prompt;
        uint256 startTime;
        uint256 endTime;
        uint256 deadline;
        uint256 maxWords;
        uint256 reward;
        ContestStatus status;
        uint256 participantCount;
        address[] participants;
        bool rewardDistributed;
    }

    struct Essay {
        uint256 id;
        uint256 contestId;
        address author;
        string title;
        string contentHash; // IPFS hash or other storage reference
        uint256 submittedAt;
        uint256 aiScore;
        string feedback;
        EssayStatus status;
    }

    struct UserProfile {
        string name;
        uint256 submissionsCount;
        uint256 totalScore;
        uint256 contestsWon;
        uint256[] essayIds;
    }

    // 枚举定义
    enum ContestStatus { Upcoming, Active, Ended }
    enum EssayStatus { Submitted, Grading, Graded }

    // 状态变量
    uint256 public nextContestId = 1;
    uint256 public nextEssayId = 1;
    
    mapping(uint256 => Contest) public contests;
    mapping(uint256 => Essay) public essays;
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => uint256[]) public contestEssays; // contestId => essayIds
    mapping(uint256 => address) public contestWinners; // contestId => winner address
    mapping(address => bool) public authorizedScorers; // AI scoring service addresses
    
    uint256[] public activeContestIds;
    uint256[] public allContestIds;

    // 修饰符
    modifier onlyAuthorizedScorer() {
        require(authorizedScorers[msg.sender] || msg.sender == owner(), "Not authorized to score");
        _;
    }

    modifier contestExists(uint256 _contestId) {
        require(_contestId > 0 && _contestId < nextContestId, "Contest does not exist");
        _;
    }

    modifier essayExists(uint256 _essayId) {
        require(_essayId > 0 && _essayId < nextEssayId, "Essay does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {}

    // 管理员功能：创建比赛
    function createContest(
        string memory _title,
        string memory _description,
        string memory _prompt,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _deadline,
        uint256 _maxWords,
        uint256 _reward
    ) external onlyOwner {
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_deadline >= _endTime, "Deadline must be after end time");
        require(_reward > 0, "Reward must be greater than 0");

        uint256 contestId = nextContestId++;
        
        Contest storage contest = contests[contestId];
        contest.id = contestId;
        contest.title = _title;
        contest.description = _description;
        contest.prompt = _prompt;
        contest.startTime = _startTime;
        contest.endTime = _endTime;
        contest.deadline = _deadline;
        contest.maxWords = _maxWords;
        contest.reward = _reward;
        contest.status = ContestStatus.Upcoming;
        contest.participantCount = 0;
        contest.rewardDistributed = false;

        allContestIds.push(contestId);
        
        emit ContestCreated(contestId, _title, _endTime, _reward);
    }

    // 用户功能：提交文章
    function submitEssay(
        uint256 _contestId,
        string memory _title,
        string memory _contentHash
    ) external contestExists(_contestId) {
        Contest storage contest = contests[_contestId];
        require(block.timestamp >= contest.startTime, "Contest has not started");
        require(block.timestamp <= contest.endTime, "Contest submission period has ended");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty");

        // 检查用户是否已经在此比赛中提交过文章
        uint256[] memory userEssayIds = userProfiles[msg.sender].essayIds;
        for (uint256 i = 0; i < userEssayIds.length; i++) {
            require(essays[userEssayIds[i]].contestId != _contestId, "Already submitted to this contest");
        }

        uint256 essayId = nextEssayId++;
        
        Essay storage essay = essays[essayId];
        essay.id = essayId;
        essay.contestId = _contestId;
        essay.author = msg.sender;
        essay.title = _title;
        essay.contentHash = _contentHash;
        essay.submittedAt = block.timestamp;
        essay.aiScore = 0;
        essay.status = EssayStatus.Submitted;

        // 更新比赛参与者信息
        if (userProfiles[msg.sender].submissionsCount == 0) {
            contest.participants.push(msg.sender);
            contest.participantCount++;
        }

        // 更新用户档案
        UserProfile storage profile = userProfiles[msg.sender];
        profile.submissionsCount++;
        profile.essayIds.push(essayId);

        // 添加到比赛文章列表
        contestEssays[_contestId].push(essayId);

        emit EssaySubmitted(_contestId, essayId, msg.sender);
    }

    // AI评分功能
    function scoreEssay(
        uint256 _essayId,
        uint256 _score,
        string memory _feedback
    ) external onlyAuthorizedScorer essayExists(_essayId) {
        require(_score <= 100, "Score must be between 0 and 100");
        
        Essay storage essay = essays[_essayId];
        require(essay.status != EssayStatus.Graded, "Essay already graded");

        essay.aiScore = _score;
        essay.feedback = _feedback;
        essay.status = EssayStatus.Graded;

        // 更新用户总分
        UserProfile storage profile = userProfiles[essay.author];
        profile.totalScore += _score;

        emit EssayScored(essay.contestId, _essayId, _score);
    }

    // 结束比赛并分发奖励
    function endContest(uint256 _contestId) external contestExists(_contestId) {
        Contest storage contest = contests[_contestId];
        require(block.timestamp >= contest.deadline, "Contest deadline has not passed");
        require(contest.status != ContestStatus.Ended, "Contest already ended");
        require(!contest.rewardDistributed, "Reward already distributed");

        contest.status = ContestStatus.Ended;

        // 找到最高分获得者
        address winner = findContestWinner(_contestId);
        if (winner != address(0)) {
            contestWinners[_contestId] = winner;
            
            // 分发奖励 (假设使用ETH，实际项目中可能使用代币)
            if (contest.reward > 0 && address(this).balance >= contest.reward) {
                payable(winner).transfer(contest.reward);
                userProfiles[winner].contestsWon++;
                contest.rewardDistributed = true;
                
                emit RewardDistributed(_contestId, winner, contest.reward);
            }
        }

        emit ContestEnded(_contestId);
    }

    // 查找比赛获胜者
    function findContestWinner(uint256 _contestId) internal view returns (address) {
        uint256[] memory essayIds = contestEssays[_contestId];
        if (essayIds.length == 0) return address(0);

        address winner = address(0);
        uint256 highestScore = 0;

        for (uint256 i = 0; i < essayIds.length; i++) {
            Essay memory essay = essays[essayIds[i]];
            if (essay.status == EssayStatus.Graded && essay.aiScore > highestScore) {
                highestScore = essay.aiScore;
                winner = essay.author;
            }
        }

        return winner;
    }

    // 管理员功能：授权AI评分服务
    function authorizeScorer(address _scorer) external onlyOwner {
        authorizedScorers[_scorer] = true;
    }

    function revokeScorer(address _scorer) external onlyOwner {
        authorizedScorers[_scorer] = false;
    }

    // 更新用户档案
    function updateUserProfile(string memory _name) external {
        userProfiles[msg.sender].name = _name;
    }

    // 查询函数
    function getContest(uint256 _contestId) external view contestExists(_contestId) returns (Contest memory) {
        return contests[_contestId];
    }

    function getEssay(uint256 _essayId) external view essayExists(_essayId) returns (Essay memory) {
        return essays[_essayId];
    }

    function getContestEssays(uint256 _contestId) external view contestExists(_contestId) returns (uint256[] memory) {
        return contestEssays[_contestId];
    }

    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }

    function getActiveContests() external view returns (uint256[] memory) {
        uint256[] memory active = new uint256[](allContestIds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allContestIds.length; i++) {
            uint256 contestId = allContestIds[i];
            Contest memory contest = contests[contestId];
            if (contest.status == ContestStatus.Active || 
                (contest.status == ContestStatus.Upcoming && block.timestamp >= contest.startTime)) {
                active[count] = contestId;
                count++;
            }
        }
        
        // 创建正确大小的数组
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = active[j];
        }
        
        return result;
    }

    function getAllContests() external view returns (uint256[] memory) {
        return allContestIds;
    }

    function getContestLeaderboard(uint256 _contestId) external view contestExists(_contestId) returns (
        address[] memory authors,
        uint256[] memory scores,
        string[] memory essayTitles
    ) {
        uint256[] memory essayIds = contestEssays[_contestId];
        uint256 gradedCount = 0;
        
        // 统计已评分的文章数量
        for (uint256 i = 0; i < essayIds.length; i++) {
            if (essays[essayIds[i]].status == EssayStatus.Graded) {
                gradedCount++;
            }
        }
        
        authors = new address[](gradedCount);
        scores = new uint256[](gradedCount);
        essayTitles = new string[](gradedCount);
        
        uint256 index = 0;
        for (uint256 i = 0; i < essayIds.length; i++) {
            Essay memory essay = essays[essayIds[i]];
            if (essay.status == EssayStatus.Graded) {
                authors[index] = essay.author;
                scores[index] = essay.aiScore;
                essayTitles[index] = essay.title;
                index++;
            }
        }
        
        // 简单的冒泡排序，按分数降序排列
        for (uint256 i = 0; i < gradedCount - 1; i++) {
            for (uint256 j = 0; j < gradedCount - i - 1; j++) {
                if (scores[j] < scores[j + 1]) {
                    // 交换分数
                    uint256 tempScore = scores[j];
                    scores[j] = scores[j + 1];
                    scores[j + 1] = tempScore;
                    
                    // 交换作者
                    address tempAuthor = authors[j];
                    authors[j] = authors[j + 1];
                    authors[j + 1] = tempAuthor;
                    
                    // 交换标题
                    string memory tempTitle = essayTitles[j];
                    essayTitles[j] = essayTitles[j + 1];
                    essayTitles[j + 1] = tempTitle;
                }
            }
        }
        
        return (authors, scores, essayTitles);
    }

    // 接受以太币存款用于奖励
    receive() external payable {}

    // 管理员提取资金
    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(_amount);
    }
}
