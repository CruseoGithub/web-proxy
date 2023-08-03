const axios = require('axios').default;
const stream = require('stream');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required!');
  }

  try {
    const response = await axios.get(url, {
      responseType: 'stream'
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Set Content-Type header to match the original response
    res.setHeader('Content-Type', response.headers['content-type']);

    // If the response content type is JSON, convert the stream to JSON and send it
    if (response.headers['content-type'].includes('application/json')) {
      let data = '';
      response.data.on('data', chunk => data += chunk);
      response.data.on('end', () => res.json(JSON.parse(data)));
    } else {
      // Otherwise, pipe the response data as a stream
      response.data.pipe(res);
    }

  } catch (error) {
    res.status(500).send('Error fetching data');
  }
};




/* const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/proxy', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 */