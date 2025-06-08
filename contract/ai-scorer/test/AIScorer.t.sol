// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {AIScorer} from "../src/AIScorer.sol";

contract AIScorerTest is Test {
    AIScorer public aiScorer;
    address public owner;
    address public scorer1;
    address public scorer2;
    address public user1;
    address public user2;
    address public user3;

    // 测试事件
    event ContestCreated(uint256 indexed contestId, string title, uint256 endTime, uint256 reward);
    event EssaySubmitted(uint256 indexed contestId, uint256 indexed essayId, address indexed author);
    event EssayScored(uint256 indexed contestId, uint256 indexed essayId, uint256 score);
    event RewardDistributed(uint256 indexed contestId, address indexed winner, uint256 reward);
    event ContestEnded(uint256 indexed contestId);

    function setUp() public {
        // 设置测试账户
        owner = address(this);
        scorer1 = makeAddr("scorer1");
        scorer2 = makeAddr("scorer2");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        
        // 部署合约
        aiScorer = new AIScorer();
        
        // 授权评分者
        aiScorer.authorizeScorer(scorer1);
        aiScorer.authorizeScorer(scorer2);
        
        // 为合约充值以支付奖励
        vm.deal(address(aiScorer), 10 ether);
    }

    function test_CreateContest() public {
        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 1 days;
        uint256 deadline = endTime + 1 hours;
        uint256 reward = 1 ether;

        // 测试事件触发
        vm.expectEmit(true, false, false, true);
        emit ContestCreated(1, "Test Contest", endTime, reward);

        // 创建比赛
        aiScorer.createContest{value: reward}(
            "Test Contest",
            "A test contest description",
            "Write about technology",
            startTime,
            endTime,
            deadline,
            1000
        );

        // 验证比赛信息
        AIScorer.Contest memory contest = aiScorer.getContest(1);
        assertEq(contest.id, 1);
        assertEq(contest.title, "Test Contest");
        assertEq(contest.description, "A test contest description");
        assertEq(contest.prompt, "Write about technology");
        assertEq(contest.startTime, startTime);
        assertEq(contest.endTime, endTime);
        assertEq(contest.deadline, deadline);
        assertEq(contest.maxWords, 1000);
        assertEq(contest.reward, reward);
        assertEq(uint(contest.status), uint(AIScorer.ContestStatus.Upcoming));
        assertEq(contest.participantCount, 0);
        assertEq(contest.rewardDistributed, false);
    }

    function test_CreateContestFailures() public {
        uint256 currentTime = block.timestamp;
        
        // 测试开始时间在过去
        vm.expectRevert("Start time must be in the future");
        aiScorer.createContest{value: 1 ether}(
            "Test Contest",
            "Description",
            "Prompt",
            currentTime - 1,
            currentTime + 1 days,
            currentTime + 2 days,
            1000
        );

        // 测试结束时间早于开始时间
        vm.expectRevert("End time must be after start time");
        aiScorer.createContest{value: 1 ether}(
            "Test Contest",
            "Description", 
            "Prompt",
            currentTime + 1 hours,
            currentTime + 30 minutes,
            currentTime + 2 hours,
            1000
        );

        // 测试截止时间早于结束时间
        vm.expectRevert("Deadline must be after end time");
        aiScorer.createContest{value: 1 ether}(
            "Test Contest",
            "Description",
            "Prompt", 
            currentTime + 1 hours,
            currentTime + 2 hours,
            currentTime + 90 minutes,
            1000
        );

        // 测试奖励为0
        vm.expectRevert("Insufficient payment");
        aiScorer.createContest{value: 0}(
            "Test Contest",
            "Description",
            "Prompt",
            currentTime + 1 hours,
            currentTime + 2 hours,
            currentTime + 3 hours,
            1000
        );
    }

    function test_SubmitEssay() public {
        // 先创建比赛
        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 1 days;
        uint256 deadline = endTime + 1 hours;
        
        aiScorer.createContest{value: 1 ether}(
            "Test Contest",
            "Description",
            "Write about AI",
            startTime,
            endTime,
            deadline,
            1000
        );

        // 时间快进到比赛开始
        vm.warp(startTime);

        // 测试事件触发
        vm.expectEmit(true, true, true, false);
        emit EssaySubmitted(1, 1, user1);

        // 用户提交文章
        vm.prank(user1);
        aiScorer.submitEssay(1, "My AI Essay", "QmTestHash123");

        // 验证文章信息
        AIScorer.Essay memory essay = aiScorer.getEssay(1);
        assertEq(essay.id, 1);
        assertEq(essay.contestId, 1);
        assertEq(essay.author, user1);
        assertEq(essay.title, "My AI Essay");
        assertEq(essay.contentHash, "QmTestHash123");
        assertEq(essay.submittedAt, startTime);
        assertEq(essay.aiScore, 0);
        assertEq(uint(essay.status), uint(AIScorer.EssayStatus.Submitted));

        // 验证用户档案更新
        AIScorer.UserProfile memory profile = aiScorer.getUserProfile(user1);
        assertEq(profile.submissionsCount, 1);
        assertEq(profile.totalScore, 0);
        assertEq(profile.contestsWon, 0);
        assertEq(profile.essayIds.length, 1);
        assertEq(profile.essayIds[0], 1);

        // 验证比赛文章列表
        uint256[] memory contestEssays = aiScorer.getContestEssays(1);
        assertEq(contestEssays.length, 1);
        assertEq(contestEssays[0], 1);
    }

    function test_SubmitEssayFailures() public {
        // 创建比赛
        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 1 days;
        uint256 deadline = endTime + 1 hours;
        
        aiScorer.createContest{value: 1 ether}(
            "Test Contest",
            "Description",
            "Write about AI",
            startTime,
            endTime,
            deadline,
            1000
        );

        // 测试比赛未开始
        vm.expectRevert("Contest has not started");
        vm.prank(user1);
        aiScorer.submitEssay(1, "Title", "Hash");

        // 时间快进到比赛结束后
        vm.warp(endTime + 1);
        vm.expectRevert("Contest submission period has ended");
        vm.prank(user1);
        aiScorer.submitEssay(1, "Title", "Hash");

        // 时间快进到比赛期间
        vm.warp(startTime + 1 hours);

        // 测试空标题
        vm.expectRevert("Title cannot be empty");
        vm.prank(user1);
        aiScorer.submitEssay(1, "", "Hash");

        // 测试空内容哈希
        vm.expectRevert("Content hash cannot be empty");
        vm.prank(user1);
        aiScorer.submitEssay(1, "Title", "");

        // 正常提交
        vm.prank(user1);
        aiScorer.submitEssay(1, "Title", "Hash");

        // 测试重复提交
        vm.expectRevert("Already submitted to this contest");
        vm.prank(user1);
        aiScorer.submitEssay(1, "Another Title", "Another Hash");
    }

    function test_ScoreEssay() public {
        // 创建比赛并提交文章
        _createContestAndSubmitEssay();

        // 测试事件触发
        vm.expectEmit(true, true, false, true);
        emit EssayScored(1, 1, 85);

        // AI评分
        vm.prank(scorer1);
        aiScorer.scoreEssay(1, 85, "Great essay with good structure");

        // 验证评分结果
        AIScorer.Essay memory essay = aiScorer.getEssay(1);
        assertEq(essay.aiScore, 85);
        assertEq(essay.feedback, "Great essay with good structure");
        assertEq(uint(essay.status), uint(AIScorer.EssayStatus.Graded));

        // 验证用户总分更新
        AIScorer.UserProfile memory profile = aiScorer.getUserProfile(user1);
        assertEq(profile.totalScore, 85);
    }

    function test_ScoreEssayFailures() public {
        _createContestAndSubmitEssay();

        // 测试非授权评分者
        vm.expectRevert("Not authorized to score");
        vm.prank(user2);
        aiScorer.scoreEssay(1, 85, "Feedback");

        // 测试分数超过100
        vm.expectRevert("Score must be between 0 and 100");
        vm.prank(scorer1);
        aiScorer.scoreEssay(1, 101, "Feedback");

        // 正常评分
        vm.prank(scorer1);
        aiScorer.scoreEssay(1, 85, "Good work");

        // 测试重复评分
        vm.expectRevert("Essay already graded");
        vm.prank(scorer1);
        aiScorer.scoreEssay(1, 90, "Even better");
    }

    function test_EndContestAndDistributeReward() public {
        // 创建比赛，多个用户提交文章并评分
        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 1 days;
        uint256 deadline = endTime + 1 hours;
        uint256 reward = 1 ether;
        
        aiScorer.createContest{value: reward}(
            "Test Contest",
            "Description",
            "Write about AI",
            startTime,
            endTime,
            deadline,
            1000
        );

        // 时间快进到比赛期间
        vm.warp(startTime + 1 hours);

        // 多个用户提交文章
        vm.prank(user1);
        aiScorer.submitEssay(1, "User1 Essay", "Hash1");
        
        vm.prank(user2);
        aiScorer.submitEssay(1, "User2 Essay", "Hash2");
        
        vm.prank(user3);
        aiScorer.submitEssay(1, "User3 Essay", "Hash3");

        // AI评分 - user2获得最高分
        vm.prank(scorer1);
        aiScorer.scoreEssay(1, 75, "Good");
        
        vm.prank(scorer1);
        aiScorer.scoreEssay(2, 90, "Excellent"); // 最高分
        
        vm.prank(scorer1);
        aiScorer.scoreEssay(3, 80, "Very good");

        // 记录获胜者的初始余额
        uint256 initialBalance = user2.balance;

        // 时间快进到截止时间后
        vm.warp(deadline + 1);

        // 测试事件触发
        vm.expectEmit(true, true, false, true);
        emit RewardDistributed(1, user2, reward);
        
        vm.expectEmit(true, false, false, false);
        emit ContestEnded(1);

        // 结束比赛
        aiScorer.endContest(1);

        // 验证比赛状态
        AIScorer.Contest memory contest = aiScorer.getContest(1);
        assertEq(uint(contest.status), uint(AIScorer.ContestStatus.Ended));
        assertEq(contest.rewardDistributed, true);

        // 验证获胜者
        assertEq(aiScorer.contestWinners(1), user2);

        // 验证奖励发放
        assertEq(user2.balance, initialBalance + reward);

        // 验证获胜者统计更新
        AIScorer.UserProfile memory winnerProfile = aiScorer.getUserProfile(user2);
        assertEq(winnerProfile.contestsWon, 1);
    }

    function test_EndContestFailures() public {
        _createContestAndSubmitEssay();

        // 获取实际的比赛信息来获取正确的截止时间
        AIScorer.Contest memory contest = aiScorer.getContest(1);
        uint256 deadline = contest.deadline;

        // 测试截止时间未到
        vm.expectRevert("Contest deadline has not passed");
        aiScorer.endContest(1);

        // 时间快进到截止时间后
        vm.warp(deadline + 1);

        // 正常结束比赛
        aiScorer.endContest(1);

        // 测试重复结束
        vm.expectRevert("Contest already ended");
        aiScorer.endContest(1);
    }

    function test_GetContestLeaderboard() public {
        // 创建比赛，多个用户提交并评分
        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 1 days;
        uint256 deadline = endTime + 1 hours;

        aiScorer.createContest{value: 1 ether}(
            "Test Contest",
            "Description",
            "Write about AI",
            startTime,
            endTime,
            deadline,
            1000
        );

        vm.warp(startTime + 1 hours);

        // 提交文章
        vm.prank(user1);
        aiScorer.submitEssay(1, "Essay A", "Hash1");
        
        vm.prank(user2);
        aiScorer.submitEssay(1, "Essay B", "Hash2");
        
        vm.prank(user3);
        aiScorer.submitEssay(1, "Essay C", "Hash3");

        // 评分（分数：75, 90, 80）
        vm.prank(scorer1);
        aiScorer.scoreEssay(1, 75, "Good");
        
        vm.prank(scorer1);
        aiScorer.scoreEssay(2, 90, "Excellent");
        
        vm.prank(scorer1);
        aiScorer.scoreEssay(3, 80, "Very good");

        // 获取排行榜（应该按分数降序排列）
        (address[] memory authors, uint256[] memory scores, string[] memory titles) = 
            aiScorer.getContestLeaderboard(1);

        // 验证排序正确（90, 80, 75）
        assertEq(authors.length, 3);
        assertEq(authors[0], user2); // 最高分
        assertEq(authors[1], user3);
        assertEq(authors[2], user1);
        
        assertEq(scores[0], 90);
        assertEq(scores[1], 80);
        assertEq(scores[2], 75);
        
        assertEq(titles[0], "Essay B");
        assertEq(titles[1], "Essay C");
        assertEq(titles[2], "Essay A");
    }

    function test_AuthorizeAndRevokeScorer() public {
        address newScorer = makeAddr("newScorer");
        
        // 初始状态
        assertEq(aiScorer.authorizedScorers(newScorer), false);
        
        // 授权
        aiScorer.authorizeScorer(newScorer);
        assertEq(aiScorer.authorizedScorers(newScorer), true);
        
        // 撤销授权
        aiScorer.revokeScorer(newScorer);
        assertEq(aiScorer.authorizedScorers(newScorer), false);
    }

    function test_UpdateUserProfile() public {
        vm.prank(user1);
        aiScorer.updateUserProfile("Alice");
        
        AIScorer.UserProfile memory profile = aiScorer.getUserProfile(user1);
        assertEq(profile.name, "Alice");
    }

    function test_GetActiveContests() public {
        uint256 currentTime = block.timestamp;
        
        // 创建不同状态的比赛
        // 即将开始的比赛
        aiScorer.createContest{value: 1 ether}(
            "Upcoming Contest",
            "Description",
            "Prompt",
            currentTime + 2 hours,
            currentTime + 3 hours,
            currentTime + 4 hours,
            1000
        );
        
        // 正在进行的比赛
        aiScorer.createContest{value: 1 ether}(
            "Active Contest",
            "Description", 
            "Prompt",
            currentTime + 1 hours,
            currentTime + 2 hours,
            currentTime + 3 hours,
            1000
        );

        // 时间快进到第二个比赛开始
        vm.warp(currentTime + 90 minutes);
        
        uint256[] memory activeContests = aiScorer.getActiveContests();
        assertEq(activeContests.length, 1);
        assertEq(activeContests[0], 2); // 第二个比赛
    }

    // 辅助函数：创建比赛并提交文章
    function _createContestAndSubmitEssay() internal {
        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 1 days;
        uint256 deadline = endTime + 1 hours;
        
        aiScorer.createContest{value: 1 ether}(
            "Test Contest",
            "Description",
            "Write about AI",
            startTime,
            endTime,
            deadline,
            1000
        );

        vm.warp(startTime + 1 hours);
        
        vm.prank(user1);
        aiScorer.submitEssay(1, "My Essay", "QmTestHash");
    }
}
