import axios from "axios";
import React, { useState } from "react";
import { DateTime } from "luxon";
import { useDownloadFile } from "../../customHooks/useDownloadFile";
import { Button, ButtonState } from "../button";
import { Alert, Container } from "react-bootstrap";

export const DownloadSampleCsvFile: React.FC = () => {
  const [buttonState, setButtonState] = useState<ButtonState>(
    ButtonState.Primary
  );
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const preDownloading = () => setButtonState(ButtonState.Loading);
  const postDownloading = () => setButtonState(ButtonState.Primary);

  const onErrorDownloadFile = () => {
    setButtonState(ButtonState.Primary);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const getFileName = () => {
    return DateTime.local().toISODate() + "_sample-file.csv";
  };

  const downloadSampleCsvFile = () => {
    // throw new Error("hello");
    return axios.get(
      "https://raw.githubusercontent.com/anubhav-goel/react-download-file-axios/main/sampleFiles/csv-sample.csv",
      { responseType: "blob" }
    );
  };

  const { fileRef, fileUrl, downloadFile, fileName } = useDownloadFile({
    asyncFunction: downloadSampleCsvFile,
    preDownloading,
    postDownloading,
    onError: onErrorDownloadFile,
    getFileName,
  });

  return (
    <Container className="mt-5">
      <Alert variant="danger" show={showAlert}>
        Something went wrong. Please try again!
      </Alert>
      <a href={fileUrl} download={fileName} className="hidden" ref={fileRef} />
      <Button
        label="Download"
        buttonState={buttonState}
        onClick={downloadFile}
      />
    </Container>
  );
};
