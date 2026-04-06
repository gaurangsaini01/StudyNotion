import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { FiFileText, FiUploadCloud } from "react-icons/fi";

export default function FileDropzone({
  name,
  label,
  register,
  setValue,
  errors,
  accept,
  helperText,
  required = false,
  disabled = false,
  viewData = null,
  editData = null,
  viewLabel = "",
  editLabel = "",
  onFileRemove,
  onFileSelect,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const existingFileUrl = viewData || editData || "";
  const existingFileLabel = viewLabel || editLabel || "";
  const [fileLabel, setFileLabel] = useState(
    existingFileLabel || (existingFileUrl ? getFileLabel(existingFileUrl) : "")
  );

  const onDrop = (acceptedFiles) => {
    if (disabled) {
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setFileLabel(file.name);
      onFileSelect?.(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    onDrop,
    multiple: false,
    noClick: true,
    disabled,
  });

  useEffect(() => {
    register(name, { required });
  }, [name, register, required]);

  useEffect(() => {
    if (!selectedFile && (existingFileLabel || existingFileUrl)) {
      setFileLabel(existingFileLabel || getFileLabel(existingFileUrl));
    }
  }, [existingFileLabel, existingFileUrl, selectedFile]);

  useEffect(() => {
    setValue(name, selectedFile, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: required,
    });
  }, [name, required, selectedFile, setValue]);

  function clearSelection() {
    setSelectedFile(null);
    setValue(name, null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: required,
    });
    setFileLabel("");
    onFileRemove?.();
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {required && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[200px] rounded-md border-2 border-dotted border-richblack-500`}
      >
        {fileLabel ? (
          <div className="flex w-full flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-richblack-800">
              <FiFileText className="text-2xl text-yellow-50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-richblack-5">{fileLabel}</p>
              <p className="text-xs text-richblack-300">
                {selectedFile
                  ? "PDF notes ready to be uploaded with this lecture."
                  : "PDF notes currently attached to this lecture."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!disabled && (
                <>
                <button
                  type="button"
                  onClick={open}
                  className="rounded-md bg-richblack-800 px-4 py-2 text-sm font-medium text-yellow-50 transition-all duration-200 hover:scale-95"
                >
                  Replace PDF
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="rounded-md bg-richblack-800 px-4 py-2 text-sm font-medium text-richblack-100 transition-all duration-200 hover:scale-95"
                >
                  Remove
                </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center p-6 text-center">
            <input {...getInputProps()} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[260px] text-sm text-richblack-200">
              Drag and drop a PDF, or click{" "}
              <button
                type="button"
                onClick={open}
                disabled={disabled}
                className="font-semibold text-yellow-50"
              >
                Browse
              </button>
            </p>
            <p className="mt-3 text-xs text-richblack-300">
              {helperText || "Only PDF files are supported"}
            </p>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

function getFileLabel(fileReference) {
  if (!fileReference) {
    return "";
  }

  if (typeof fileReference === "string") {
    const cleanReference = fileReference.split("?")[0];
    const label = cleanReference.substring(cleanReference.lastIndexOf("/") + 1);
    return label || "Uploaded file";
  }

  return fileReference.name || "Uploaded file";
}

FileDropzone.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  accept: PropTypes.object,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  viewData: PropTypes.any,
  editData: PropTypes.any,
  viewLabel: PropTypes.string,
  editLabel: PropTypes.string,
  onFileRemove: PropTypes.func,
  onFileSelect: PropTypes.func,
};
