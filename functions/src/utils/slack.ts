import CONSTANTS from "./constants";

const Slack = {
  getAccessInfo: (code: string) => {
    const params = [
      `code=${code}`,
      `client_id=${CONSTANTS.APP_CLIENT_ID}`,
      `client_secret=${CONSTANTS.APP_CLIENT_SECRET}`,
    ].join("&");
    return fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    }).then((data) => data.json());
  },
  sendMessage: (accessToken: string, channelId: string, message: string) => {
    return fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({channel: channelId, text: message}),
    }).then((data) => data.json());
  },
};

export default Slack;
