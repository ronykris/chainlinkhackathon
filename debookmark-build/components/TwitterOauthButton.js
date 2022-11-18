import 'tailwindcss/tailwind.css'

const CLIENT_ID = 'ckEzMFR2dDhJUTRSXzhwSVZfTHY6MTpjaQ'

function getTwitterOauthURL() {
    const oauthEndpoint = "https://twitter.com/i/oauth2/authorize"
    const options = {
        redirect_uri: "http://www.localhost:3001/oauth/twitter", // client url cannot be http://localhost:3000/ or http://127.0.0.1:3000/
        client_id: CLIENT_ID,
        state: "state",
        response_type: "code",
        code_challenge: "challenge",
        code_challenge_method: "plain",
        scope: ["users.read", "tweet.read", "bookmark.read", "offline.access"].join(" "), // add/remove scopes as needed
    }
    const qs = new URLSearchParams(options).toString();
    return `${oauthEndpoint}?${qs}`;
}

// the component
export function TwitterOauthButton() {
    return (
      <a className="text-blue-600" href={getTwitterOauthURL()}>      
        <p>{" twitter"}</p>
      </a>
    );
  }