import axios from 'axios';
import dotenv from 'dotenv';
import { dsAISystemMessage } from '../../constants/ai/dsAI';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || '';

/**
 * 从DeepSeek API获取完成结果
 * @param content 用户输入内容
 * @returns 返回DeepSeek的响应文本
 */
async function fetchDeepSeekCompletion(content: string): Promise<string> {
    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: dsAISystemMessage },
                    {
                        role: 'user',
                        content: content,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                },
            },
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('DeepSeek API 调用失败:', error);
        throw new Error('无法获取 DeepSeek 完成结果');
    }
}

export default fetchDeepSeekCompletion;
