const express = require('express');
const router = express.Router();
const { Mistral } = require('@mistralai/mistralai');

// ✅ Initialize Mistral with API key from environment variables
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

router.post('/suggest-tasks', async (req, res) => {
  const { projectTitle, description } = req.body;

  // Check if API key is configured
  if (!process.env.MISTRAL_API_KEY) {
    console.error('❌ MISTRAL_API_KEY is not set in .env file');
    return res.status(500).json({ error: 'AI service not configured. Please add MISTRAL_API_KEY to .env file.' });
  }

  // Prompt clearly asking for 5 bullet-point tasks
  const prompt = `Suggest 5 development tasks for a software project titled "${projectTitle}".
Description: ${description || 'No description provided'}.
Return only 5 tasks, one per line, without numbering or bullet points. Just the task descriptions.`;

  try {
    console.log('🤖 Sending request to Mistral AI...');
    console.log('Project:', projectTitle);
    
    // 🔍 Ask Mistral (using open-mistral-7b free tier model)
    const response = await mistral.chat.complete({
      model: 'open-mistral-7b',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 300,
    });

    const raw = response.choices[0].message.content || '';
    console.log('✅ Received response from Mistral AI');
    console.log('Raw response:', raw.substring(0, 200));

    // 🧹 Clean up response to return individual task strings
    const tasks = raw
      .split('\n')
      .map(line => line.replace(/^[-*\d.)\]]+\s*/, '').trim())
      .filter(task => task.length > 3 && !task.toLowerCase().includes('here are'))
      .slice(0, 5);

    // ✅ Send array of tasks back to frontend
    if (tasks.length > 0) {
      res.json({ tasks });
    } else {
      // Fallback if parsing fails
      res.json({ tasks: [
        `Initialize ${projectTitle} project structure`,
        'Design database schema and API architecture',
        'Implement core features and functionality',
        'Write tests and documentation',
        'Deploy and set up CI/CD pipeline'
      ]});
    }
  } catch (err) {
    console.error('❌ Mistral AI error details:');
    console.error('Error message:', err.message);
    console.error('Error name:', err.name);
    console.error('Error status/statusCode:', err.status || err.statusCode);
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    res.status(500).json({ error: 'Failed to fetch AI task suggestions. Check server logs for details.' });
  }
});

module.exports = router;
