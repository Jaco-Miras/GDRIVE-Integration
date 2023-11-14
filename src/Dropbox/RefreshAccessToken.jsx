import React, { useEffect, useState } from "react";
import * as Dropbox from "dropbox";

const RefreshAccessToken = () => {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    // Function to initiate OAuth 2.0 authorization
    const authorizeDropbox = async () => {
      const dbx = new Dropbox.Dropbox({ accessToken });

      // Redirect user to Dropbox authorization URL
      const authUrl = dbx.getAuthenticationUrl("http://localhost:5173/");
      window.location.href = authUrl;
    };

    // Function to exchange code for access token
    const getAccessToken = async (code) => {
      const dbx = new Dropbox({
        clientId: "zuebcr3t2ursgev",
        clientSecret: "vbhzs09u9sr0mvz",
      });

      // Exchange code for access token
      const response = await dbx.getAccessTokenFromCode(
        "http://localhost:5173/",
        code
      );
      setAccessToken(response.result.access_token);
    };

    // Check if the URL has the code parameter
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // If code exists, exchange it for an access token
      getAccessToken(code);
    } else {
      // If no code, initiate the authorization flow
      authorizeDropbox();
    }
  }, []); // Empty dependency array to run this effect only once
  return (
    <div>
      <h1>Dropbox Integration</h1>
      <p>Access Token: {accessToken}</p>
    </div>
  );
};

export default RefreshAccessToken;
