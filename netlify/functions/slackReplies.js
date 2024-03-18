
const axios = require('axios');

exports.handler = async (event) => {
 
  const { channel, ts } = event.queryStringParameters;


  if (!channel || !ts) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Channel and ts query parameters are required.' }),
    };
  }

  try {
 
    const response = await axios.get('https://slack.com/api/conversations.replies', {
      headers: {
        
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`
      },
      params: {
        channel,
        ts,
      },
    });

    // Check if the request was successful and the response contains messages
    if (response.data.ok && response.data.messages) {
        console.log(response.data);
      // Extract only the user ID and text from each message
      const replies = response.data.messages.map(message => ({
        user: message.user || message.bot_id,
        text: message.text,

      }));

     
      return {
        statusCode: 200,
        body: JSON.stringify(replies),
      };
    } else {
      
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Failed to fetch replies or no messages found.' }),
      };
    }
  } catch (error) {
    
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
