import { AxiosResponse } from "axios";
import { useRef, useState } from "react";

interface DownloadFileProps {
  readonly asyncFunction: () => Promise<AxiosResponse<Blob>>;
  readonly preDownloading: () => void;
  readonly postDownloading: () => void;
  readonly onError: () => void;
  readonly getFileName: () => string;
}

interface DownloadedFileInfo {
  readonly downloadFile: () => Promise<void>;
  readonly fileRef: React.MutableRefObject<HTMLAnchorElement | null>;
  readonly fileName: string | undefined;
  readonly fileUrl: string | undefined;
}

export const useDownloadFile = ({
  asyncFunction,
  preDownloading,
  postDownloading,
  onError,
  getFileName,
}: DownloadFileProps): DownloadedFileInfo => {
  const fileRef = useRef<HTMLAnchorElement | null>(null);
  const [fileUrl, setFileUrl] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  const downloadFile = async () => {
    try {
      preDownloading();
      const { data } = await asyncFunction();
      const url = URL.createObjectURL(new Blob([data]));
      setFileUrl(url);
      setFileName(getFileName());
      fileRef.current?.click();
      postDownloading();
      URL.revokeObjectURL(url);
    } catch (error) {
      onError();
    }
  };

  return { downloadFile, fileRef, fileUrl, fileName };
};
