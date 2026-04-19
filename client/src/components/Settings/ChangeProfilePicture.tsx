import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateDisplayPicture } from "../../services/operations/settingsAPI";
import IconBtn from "../reusable/IconBtn";

export default function ChangeProfilePicture() {
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result as string);
    };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const handleFileUpload = () => {
    if (!imageFile || !token) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", imageFile);
      Promise.resolve(dispatch(updateDisplayPicture(token, formData))).then(
        () => {
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("ERROR MESSAGE - ", (error as Error).message);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 md:p-8 py-6 md:px-12 px-2 text-richblack-5">
      <div className="flex items-center gap-x-4">
        <img
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[78px] rounded-full object-cover"
        />
        <div className="space-y-2">
          <p>Change Profile Picture</p>
          <div className="flex flex-row gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <button
              onClick={handleClick}
              disabled={loading}
              className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
            >
              Select
            </button>
            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleFileUpload}
            >
              {!loading && <FiUpload className="text-lg text-richblack-900" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
