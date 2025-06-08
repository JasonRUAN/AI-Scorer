import { Router } from 'express';
import fetchDeepSeekCompletion from '../utils/ai/deepSeek';

const router: Router = Router();

router.post('/get_ai_score', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            res.status(400).json({ error: 'content is required.' });
            return;
        }

        console.log('>>> content', content);

        const deepSeekResponse = await fetchDeepSeekCompletion(content);
        console.log('>>> deepSeekResponse', deepSeekResponse);
        // const metadata = JSON.parse(deepSeekResponse);

        res.status(200).json({
            success: true,
            message: deepSeekResponse,
        });
    } catch (error) {
        console.error('Error fetching DeepSeek completion:', error);
        res.status(500).json({ error: 'Failed to fetch DeepSeek completion.' });
    }
});

export default router;
