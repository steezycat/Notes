const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/openai', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.response ? error.response.data : 'Something went wrong');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
