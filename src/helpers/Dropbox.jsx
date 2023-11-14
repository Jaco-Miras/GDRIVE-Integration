import React, { useEffect, useState } from "react";

const DropboxAuth = () => {
  const DROPBOX_API_KEY = "zuebcr3t2ursgev";
  const DROPBOX_API_SECRET = "vbhzs09u9sr0mvz";
  const REDIRECT_URI = "http://localhost:5173/"; // Update with your redirect URI

  const AUTH_URL = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = getAuthorizationCode();

      if (code) {
        try {
          const tokens = await exchangeCodeForTokens(code);
          const { access_token, refresh_token } = tokens;

          // Now you have the access_token and refresh_token
          console.log("Access Token:", access_token);
          console.log("Refresh Token:", refresh_token);

          // Store the refresh token securely (e.g., in a backend or encrypted storage)
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
        } catch (error) {
          console.error("Error during token exchange:", error);
        }
      } else {
        // If no code is present, initiate the OAuth flow
        initiateOAuthFlow();
      }
    };

    // Check if the URL contains an authorization code
    handleAuthCallback();
  }, []); // This effect runs once on component mount

  const getAuthorizationCode = () => {
    return new URLSearchParams(window.location.search).get("code");
  };

  const exchangeCodeForTokens = async (code) => {
    const response = await fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: DROPBOX_API_KEY,
        client_secret: DROPBOX_API_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Failed to obtain tokens from Dropbox");
    }
  };

  const initiateOAuthFlow = () => {
    window.location.href = AUTH_URL;
  };

  return (
    <div>
      <p>Checking Dropbox authorization...</p>
      {accessToken && <p>Access Token: {accessToken}</p>}
      {refreshToken && <p>Refresh Token: {refreshToken}</p>}
    </div>
  );
};

export default DropboxAuth;
