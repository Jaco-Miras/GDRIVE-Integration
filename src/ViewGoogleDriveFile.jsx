import React, { useEffect, useState } from "react";

function ViewGoogleDriveFile({ file }) {
  const [fileId, setFileId] = useState(file.id);

  useEffect(() => {
    setFileId(file.id);
  }, [file]);

  return (
    <a
      href={`https://drive.google.com/file/d/${fileId}/preview`}
      width="640"
      height="480"
      allow="autoplay"
    ></a>
  );
}

export default ViewGoogleDriveFile;
