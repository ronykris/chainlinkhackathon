import axios from 'axios'
//import { Request, Response } from "express";

const TWITTER_OAUTH_CLIENT_ID = process.env.TWITTER_CLIENT_ID
const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET
const TWITTER_OAUTH_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";

const BasicAuthToken = Buffer.from(`${TWITTER_OAUTH_CLIENT_ID}:${TWITTER_OAUTH_CLIENT_SECRET}`, "utf8").toString(
    "base64"
);

export const twitterOauthTokenParams = {
    client_id: TWITTER_OAUTH_CLIENT_ID,
    // based on code_challenge
    code_verifier: "challenge",
    redirect_uri: `http://www.localhost:3001/oauth/twitter`,
    grant_type: "authorization_code",
};

export async function getTwitterOauthToken(code) {
    const config = {
        method: 'post',
        url: TWITTER_OAUTH_TOKEN_URL,
        data: {...twitterOauthTokenParams, code: code },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${BasicAuthToken}`,
        }
    }
    try {
        const res = await axios(config)
        return res.data
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function getTwitterUser(accessToken) {
    const config = {
        method: 'get',
        url: 'https://api.twitter.com/2/users/me?user.fields=description,profile_image_url,public_metrics,url',
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    }
    try {
        const res = await axios(config)
        return res.data.data || null
    } catch (e) {
        console.error(e)
    }
}

export default async function twitterOauth(req, res) {
    const code = req.query.code

    const twitterAccessToken = await getTwitterOauthToken(code)
    console.log(twitterAccessToken)
    if (!twitterAccessToken) {
        // redirect if no auth token
        return res.redirect(process.env.CLIENT_URL);
    }

    const twitterUser = await getTwitterUser(twitterAccessToken.access_token)
    console.log(twitterUser)
    if (!twitterUser) {
        // redirect if no twitter user
        return res.redirect(process.env.CLIENT_URL);
    }

    return res.redirect(process.env.CLIENT_URL)
}