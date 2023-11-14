import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DropboxFolder = () => {
  const [contents, setContents] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("/Test Folder");
  const accessToken =
    "sl.Bp32MQQ0hqO6qRS3cMSM_fbTA4zvaDc42vnz6nFOqnz3_EA4Ftph2TM64WZsCbDGprIon-Y2I1sCNLxBzuRFxJ6h4ZGm5-RcsICHxKSi1NubCQNjhBXqZ0R4NPDNInRqfuWX9cQ23OSRML4";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolderContents = async (path) => {
      try {
        const response = await fetch(
          "https://api.dropboxapi.com/2/files/list_folder",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              path: path,
            }),
          }
        );

        const data = await response.json();

        // Extract files and subfolders from the response
        const folderContents = data.entries.map((entry) => {
          if (entry[".tag"] === "file") {
            return {
              type: "file",
              name: entry.name,
            };
          } else if (entry[".tag"] === "folder") {
            return {
              type: "folder",
              name: entry.name,
              path: entry.path_display,
            };
          }
          return null;
        });

        setContents(folderContents);
      } catch (error) {
        console.error("Error fetching folder contents:", error);
      }
    };

    // Initialize fetching with the selected folder
    fetchFolderContents(selectedFolder);
  }, [accessToken, selectedFolder]);

  const handleFolderClick = (folderPath) => {
    console.log(folderPath);
    setSelectedFolder(folderPath);

    // Use React Router to navigate to another component
    navigate(`/folder${folderPath}`);
  };
  console.log(contents);

  return (
    <div>
      <h2>Folder Contents:</h2>
      <ul>
        {contents.map((content, index) => (
          <li
            key={index}
            onClick={() =>
              content.type === "folder" && handleFolderClick(content.path)
            }
          >
            {content.type === "file" ? "File: " : "Folder: "}
            {content.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropboxFolder;
