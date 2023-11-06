import { useState, useEffect } from "react";
import { gapi } from "gapi-script";

const useGoogleDrive = () => {
  const [files, setFiles] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(
    "1C2h2AtbMTksX3LjI07yYlu8rhIIribsr"
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

  return {
    files,
    currentFolderId,
    selectedFile,
    navigateToFolder,
    handleFileClick,
    navigateToBack,
  };
};

export default useGoogleDrive;
