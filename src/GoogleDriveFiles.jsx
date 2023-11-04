import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import ViewGoogleDriveFile from "./ViewGoogleDriveFile";

function GoogleDriveFiles() {
  const [files, setFiles] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(
    "1LEzEv-2AkACmTdFgmc8LQvAqRhITY3SQ"
  );
  const [previousFolderId, setPreviousFolderId] = useState([]);
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
        // Fetch files in the initial folder (e.g., the root folder)
        fetchFilesInFolder(currentFolderId);
      });
    });
  }, []);

  const fetchFilesInFolder = (folderId) => {
    gapi.client.drive.files
      .list({
        q: `'${folderId}' in parents`,
      })
      .then((response) => {
        const folderFiles = response.result.files;
        setFiles(folderFiles);
      });
  };

  const navigateToFolder = (folderId) => {
    setPreviousFolderId(previousFolderId.concat(currentFolderId));
    setCurrentFolderId(folderId);
    fetchFilesInFolder(folderId);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };
  const navigateToBack = () => {
    setPreviousFolderId(
      previousFolderId.filter(
        (item) => item !== previousFolderId[previousFolderId.length - 1]
      )
    );
    setCurrentFolderId(previousFolderId[previousFolderId.length - 1]);
    fetchFilesInFolder(previousFolderId[previousFolderId.length - 1]);
  };
  return (
    <div>
      <h2>Files in Google Drive Folder</h2>
      <button
        onClick={(e) => {
          e.preventDefault();
          navigateToBack();
        }}
      >
        back
      </button>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.mimeType === "application/vnd.google-apps.folder" ? (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  navigateToFolder(file.id);
                }}
                className="cursor"
              >
                {file.name}
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  handleFileClick(file);
                }}
                className="cursor"
              >
                {file.name}
              </div>
            )}
          </li>
        ))}
      </ul>
      {selectedFile && <ViewGoogleDriveFile file={selectedFile} />}{" "}
      {/* Insert the ViewGoogleDriveFile component */}
    </div>
  );
}

export default GoogleDriveFiles;
