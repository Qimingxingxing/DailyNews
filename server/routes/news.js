const express = require('express');
const rpcClient = require('../rpc_client/rpc_client');
const router = express.Router();

/* GET news summary list. */
router.get('/userId/:userId/pageNum/:pageNum', async (req, res) => {
  try {
    const { userId, pageNum } = req.params;
    console.log('Fetching news...');

    const response = await rpcClient.getNewsSummariesForUser(userId, pageNum);
    res.json(response);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Log news click. */
router.post('/userId/:userId/newsId/:newsId', async (req, res) => {
  try {
    const { userId, newsId } = req.params;
    console.log('Logging news click...');

    await rpcClient.logNewsClickForUser(userId, newsId);
    res.status(200).json({ message: 'Click logged successfully' });
  } catch (error) {
    console.error('Error logging click:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
