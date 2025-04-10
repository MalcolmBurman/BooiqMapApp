import { use, useEffect, useState, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FilePond
      files={files}
      onupdatefiles={setFiles}
      allowMultiple={true}
      maxFiles={4}
      name="files" /* sets the file input name, it's filepond by default */
      labelIdle='Dra & släpp dina filer eller <span class="filepond--label-action">Bläddra</span>'
    />
  );
}
