const { Client } = require('@elastic/elasticsearch');
const { getIo } = require('../websocket/server');

const client = new Client({
    node: process.env.ELASTICSEARCH_HOST
});


const insertEmails = async (emailsData) => {
    try {
      for (const email of emailsData) {
        await client.index({
          index: 'emails',
          id: email.email_id,
          body: email
        });
      }
  
      await client.indices.refresh({ index: 'emails' });
    } catch (error) {
      console.error('Error inserting emails:', error);
    }
  };

  const fetchEmails = async (user) => {
    try {
      const response = await client.search({
        index: 'emails',
        body: {
            query: {
              match: { user_id: user.id }
            }
          }
      });
      getIo().emit('emails', response.body.hits.hits);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const createIndices = async () => {
    try {
      await client.indices.create({
        index: 'emails',
        body: {
          mappings: {
            properties: {
              user_id: { type: 'keyword' },
              email_id: { type: 'keyword' },
              from: { type: 'text' },
              to: { type: 'text' },
              subject: { type: 'text' },
              body: { type: 'text' },
              timestamp: { type: 'date' }
            }
          }
        }
      }, { ignore: [400] });

      console.log('Indices created successfully');
    } catch (error) {
      console.error('Error creating indices:', error);
    }
  };

module.exports = { createIndices, insertEmails, fetchEmails };
