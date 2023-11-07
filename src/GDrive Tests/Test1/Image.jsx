import React, { useEffect, useState } from "react";

const Image = () => {
  const folderId = "11pdYg4v0iijPjnc4ppFFbmSvTftxfWdQ";
  const apiKey = "AIzaSyC8Fzkg0Ba9xgMnXnXQxXXurF7TG-GBef0";

  const [imageUrls, setImageUrls] = useState([]);
  const [imageBlobs, setImageBlobs] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&key=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        const urls = data.files.map((file) => file.webContentLink);
        setImageUrls(urls);
      } else {
        console.error(
          "Error fetching data from Google Drive:",
          response.status
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadImagesAsBlobs = async () => {
    const blobs = [];

    for (const imageUrl of imageUrls) {
      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          const blob = await response.blob();
          blobs.push(blob);
        } else {
          console.error("Error fetching image as blob:", response.status);
        }
      } catch (error) {
        console.error(error);
      }
    }

    setImageBlobs(blobs);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (imageUrls.length > 0 && imageBlobs.length === 0) {
      loadImagesAsBlobs();
    }
  }, [imageUrls, imageBlobs]);

  useEffect(() => {
    // Create object URLs for the blobs
    const objectUrls = imageBlobs.map((blob) => URL.createObjectURL(blob));
    setImageUrls(objectUrls);

    // Clean up object URLs when component unmounts
    return () => {
      for (const objectUrl of objectUrls) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageBlobs]);

  return (
    <div>
      {imageUrls.map((imageUrl, index) => (
        <img src={imageUrl} alt={`Image ${index + 1}`} key={imageUrl} />
      ))}
    </div>
  );
};

export default Image;
