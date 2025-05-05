const express = require('express');
const router = express.Router();
const { CohereClient } = require('cohere-ai');

// ✅ Initialize Cohere with API key from environment variables
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

router.post('/suggest-tasks', async (req, res) => {
  const { projectTitle, description } = req.body;

  // Prompt clearly asking for 5 bullet-point tasks
  const prompt = `Suggest 5 development tasks for a software project titled in bullet form below "${projectTitle}".
Description: ${description}.
Return only the task list in this format and give new line after each task end:
- Task 1: 
- Task 2:
- Task 3:
- Task 4:
- Task 5:`;

  try {
    // 🔍 Ask Cohere
    const response = await cohere.chat({
      model: 'command-r-plus',
      message: prompt,
    });

    const raw = response.text || '';

    // 🧹 Clean up response to return individual task strings
    const tasks = raw
      .split('\n')
      .map(line => line.replace(/^[-*\d.]+\s*/, '').trim())
      .filter(task => task.length > 3);

    // ✅ Send array of tasks back to frontend
    res.json({ tasks });
  } catch (err) {
    console.error('❌ Cohere AI error:', err);
    res.status(500).json({ error: 'Failed to fetch AI task suggestions.' });
  }
});

module.exports = router;
