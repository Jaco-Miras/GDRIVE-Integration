import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import ViewGoogleDriveFile from "./ViewGoogleDriveFile";

function GoogleDriveFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    gapi.load("client", () => {
      gapi.client.init({
        clientId:
          "291305734001-a8cboigtjca827ivlenmg3qcom73di0r.apps.googleusercontent.com",
        apiKey: "AIzaSyC8Fzkg0Ba9xgMnXnXQxXXurF7TG-GBef0",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
        scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
      });

      gapi.client.load("drive", "v3").then(() => {
        gapi.client.drive.files
          .list({
            q: "'1LEzEv-2AkACmTdFgmc8LQvAqRhITY3SQ' in parents",
          })
          .then((response) => {
            console.log(response);
            setFiles(response.result.files);
          });
      });
    });
  }, []);

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  return (
    <div>
      <h2>Files in Google Drive Folder</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <a
              href={file.webContentLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault(); // Prevent the link from navigating
                handleFileClick(file);
              }}
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>

      {selectedFile && <ViewGoogleDriveFile file={selectedFile} />}
    </div>
  );
}

export default GoogleDriveFiles;
