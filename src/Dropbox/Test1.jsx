import React, { useEffect, useState } from "react";
import * as Dropbox from "dropbox";
import { useParams } from "react-router-dom";

const Test1 = () => {
  const { id, id2 } = useParams();
  const [files, setFiles] = useState([]);
  const accessToken =
    "sl.Bp257Qd176ShLmeaVX3yi556dh6AW1p4GJ80OlOaVkU_RLa2gByLKe5_w5P3m0GRtNEtrLdcO8I6U2e7yJAOvTY8F4pLkPtLiKQLgc8tN62j8mT-dIuGYaIsqL1zXDYW23b9u1nDlEMTNJU";
  const folderPath =
    "/" + id.replace("%20", " ") + "/" + id2.replace("%20", " ");
  console.log(folderPath);
  // const folderPath = "/Test";
  const dbx = new Dropbox.Dropbox({ accessToken });

  useEffect(() => {
    dbx
      .filesListFolder({ path: folderPath })
      .then(async (response) => {
        console.log(response);
        const filteredFiles = response.result.entries.filter((file) => {
          return (
            file.path_display &&
            file.media_info &&
            file.media_info.metadata[".tag"] === "photo"
          );
        });

        console.log(filteredFiles);

        const test = response.result.entries.map(async (file) => {
          try {
            const linksResponse = await dbx.sharingListSharedLinks({
              path: file.path_display,
            });
            console.log(linksResponse);
            if (linksResponse.result.links.length > 0) {
              const directLink = linksResponse.result.links[0].url.replace(
                "www.dropbox.com",
                "dl.dropboxusercontent.com"
              );
              const response = await fetch(directLink);

              if (!response.ok) {
                throw new Error("Failed to fetch image");
              }

              const blob = await response.blob();

              // Do something with the Blob, e.g., display it, upload it, etc.
              console.log(blob);
              return { ...file, blobbers: blob };
            }
            // Create a shareable link
            const shareResponse = await dbx.sharingCreateSharedLinkWithSettings(
              {
                path: file.path_display,
                settings: {
                  requested_visibility: { ".tag": "public" }, // Set the desired access level
                  allow_download: true,
                },
              }
            );
            console.log(shareResponse);

            // Extract the direct link from the shareable link
            const directLink = shareResponse.result.url.replace(
              "www.dropbox.com",
              "dl.dropboxusercontent.com"
            );

            // Fetch the image using the direct link
            const response = await fetch(directLink);

            if (!response.ok) {
              throw new Error("Failed to fetch image");
            }

            const blob = await response.blob();

            // Do something with the Blob, e.g., display it, upload it, etc.
            console.log(blob);
            return { ...file, blobbers: blob };
          } catch (error) {
            console.error("Error downloading image:", error);
          }
        });
        const result = await Promise.all(test);
        console.log(result);

        setFiles(result);
      })
      .catch((error) => {
        console.error("Error fetching files from Dropbox:", error);
      });
  }, []);

  console.log(files);
  return (
    <div>
      <h1>Files: </h1>
      {files.map((file) => (
        <div key={file.id} className="max-h-[225px]">
          {/* Display the image */}
          <img
            src={URL.createObjectURL(file.blobbers)}
            alt={file.name}
            className="h-[180px] object-fill"
          />
        </div>
      ))}
    </div>
  );
};

export default Test1;
