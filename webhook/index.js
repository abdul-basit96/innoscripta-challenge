const { syncEmail } = require("../services/email-service");
const axios = require('axios');

const createSubscription = async (token) => {
    try {
      const response = await axios.post(
        'https://graph.microsoft.com/v1.0/subscriptions',
        {
          changeType: 'created,updated,deleted',
          notificationUrl: process.env.WEBHOOKURL,
          resource: 'me/mailFolders(\'inbox\')/messages',
          expirationDateTime: new Date(new Date().getTime() + 3600 * 1000 * 24).toISOString(), // 24 hours from now
          clientState: process.env.CLIENT_SECRET_VALUE,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Subscription created: ', response.data);
    } catch (error) {
      console.error('Error creating subscription: ', error);
    }
  };


const webhookListen = (req, res) => {
    if (req.body.value && req.body.validationToken) {
      res.status(200).send(req.body.validationToken);
    } else {
      req.body.value.forEach(async (notification) => {
        console.log({ notification })
        if (notification.clientState === 'secretClientValue') {
          await syncEmail(notification.resource, user);
        }
      });
      res.status(202).send();
    }
  };

  module.exports = { webhookListen, createSubscription };