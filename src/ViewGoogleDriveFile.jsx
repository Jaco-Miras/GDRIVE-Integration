import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

function ViewGoogleDriveFile({ file }) {
  const [fileId, setFileId] = useState(file.id);
  useEffect(() => {
    setFileId(file.id);
    gapi.load("client", () => {
      gapi.client.init({
        clientId:
          "291305734001-a8cboigtjca827ivlenmg3qcom73di0r.apps.googleusercontent.com",
        apiKey: "AIzaSyC8Fzkg0Ba9xgMnXnXQxXXurF7TG-GBef0",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
        scope: "https://www.googleapis.com/auth/drive.readonly",
      });

      gapi.client.load("drive", "v3").then(() => {
        gapi.client.drive.files
          .get({
            fileId: file.id,
          })
          .then((response) => {
            console.log(response);
            const file = response.result;
            console.log(
              new File([response.result], response.result.name, {
                type: response.result.mimeType,
              })
            );
            if (file.webViewLink) {
              window.open(file.webViewLink);
            } else {
              console.error("File cannot be opened.");
            }
          });
      });
    });
  }, [file]);

  return (
    <iframe
      src={`https://drive.google.com/file/d/${fileId}/preview`}
      width="640"
      height="480"
      allow="autoplay"
    ></iframe>
  );
}

export default ViewGoogleDriveFile;
