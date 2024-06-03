const passport = require('passport');
const { emailWatcher } = require('../services/email-service');
const { createSubscription } = require('../webhook');
const { default: axios } = require('axios');
const OutlookStrategy = require('passport-azure-ad-oauth2').Strategy;

passport.use(new OutlookStrategy({
    clientID: process.env.OUTLOOK_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET_VALUE,
    callbackURL: process.env.REDIRECT_URI,
    resource: 'https://graph.microsoft.com/',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, params, profile, done) => {

    if (typeof accessToken !== 'string' || accessToken.split('.').length !== 3) {
        console.error('Invalid access token format:', accessToken);
        return done(new Error('Invalid access token format'));
    }

    const user = await axios.get('https://graph.microsoft.com/v1.0/me', { headers: { Authorization: `Bearer ${accessToken}` } });
    req.session.user = { ...user.data, accessToken };
    emailWatcher(req.session.user); //also we can use outlook webhooks here through createSubscription() method, i didn't use bcz http is not supported by outlook webhooks
    process.nextTick(() => done(null, profile));
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
