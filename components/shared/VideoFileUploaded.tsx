"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import type { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  videoUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function VideoFileUploader({
  videoUrl,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "video/*" ? generateClientDropzoneAccept(["video/*"]) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {videoUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <video controls>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <img
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Drag pre-recorded video here</h3>
          <p className="p-medium-12 mb-4">MP4</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
