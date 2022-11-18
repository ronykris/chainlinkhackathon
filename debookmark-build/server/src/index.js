import * as config from "./config.js"
import twitterOauth from "./oauth2.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"

const app = express()

const origin = [process.env.CLIENT_URL]

app.use(cookieParser())
app.use(cors({
    origin,
    credentials: true
}))

app.get("/ping", (_, res) => res.json("pong"))
app.get("/oauth/twitter", twitterOauth);
app.listen(config.SERVER_PORT, () => console.log(`Server listening on ${config.SERVER_PORT}`))