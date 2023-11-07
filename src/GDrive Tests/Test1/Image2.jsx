import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const Image2 = () => {
  const [test, setTest] = useState();

  useEffect(() => {
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
        // fetchFilesInFolder(currentFolderId);
        const fileId = "1scHAMW0Zqfpx5LVt_Yf1nQjJvbHKscZ9";

        // Use the files.get method with alt=media to download the file
        gapi.client.drive.files
          .get({
            fileId,
            alt: "media",
          })
          .then((response) => {
            // return response.arrayBuffer();
            // Handle the image data (e.g., display it or save it)
            console.log(response);
            const imageContent = response.body;
            console.log(imageContent);
            // const file = new File([imageContent], "hi", {
            //   type: "image/png",
            // });
            // console.log(file);

            const blob = new Blob([imageContent], { type: "image/jpeg" }); // Update the 'type' accordingly based on your image format
            const previewUrl = URL.createObjectURL(blob);
            // const file = new File([blob], "hi", {
            //   type: "image/png",
            // });
            console.log(previewUrl);
            setTest(previewUrl);
            // Handle the image content as needed
          });
      });
    });
  }, []);
  return (
    <div>
      <img src={test} alt="" />
    </div>
  );
};

export default Image2;
