const axios = require('axios');
const { insertEmails, fetchEmails } = require('../elastic-search/client');
const rateLimit = require('axios-rate-limit');

const http = rateLimit(axios.create(), {
    maxRequests: 60,
    perMilliseconds: 60000,
  });

const getEmails = async (accessToken) => {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await http.get('https://graph.microsoft.com/v1.0/me/messages', { headers });
    return response.status === 200 ? response.data.value : [];
};

const syncEmails = async (user) => {
    const emails = await getEmails(user.accessToken);
    const emailsData = [];

    for (const email of emails) {
        emailsData.push({
            user_id: user.id,
            email_id: email.id,
            from: email.from.emailAddress.address,
            to: email.toRecipients[0].emailAddress.address,
            subject: email.subject,
            body: email.bodyPreview,
            timestamp: email.sentDateTime
        })
    }

    insertEmails(emailsData);
};

const emailWatcher = (user) => {
    setInterval(async () => {
        await syncEmails(user);
        await fetchEmails(user);
    }, 2000);
};

module.exports = { syncEmails, emailWatcher, fetchEmails };
