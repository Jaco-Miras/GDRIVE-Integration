import ViewGoogleDriveFile from "./ViewGoogleDriveFile";
import useGoogleDrive from "./hooks/useGoogleDrive";

function GoogleDriveFiles() {
  const {
    files,
    currentFolderId,
    selectedFile,
    navigateToFolder,
    handleFileClick,
    navigateToBack,
  } = useGoogleDrive();

  const redirectToGoogleDrive = (file) => {
    const googleDriveUrl = `https://drive.google.com/file/d/${file.id}`;
    window.location.href = googleDriveUrl;
  };
  const redirectToGoogleDriveFolder = (file) => {
    const googleDriveUrl = `https://drive.google.com/drive/u/0/folders/${file.id}`;
    window.location.href = googleDriveUrl;
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
                  redirectToGoogleDriveFolder(file);
                }}
                className="cursor"
              >
                {file.name}
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  redirectToGoogleDrive(file);
                }}
                className="cursor"
              >
                {file.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoogleDriveFiles;
