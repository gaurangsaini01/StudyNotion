import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "video-react/dist/video-react.css";
// @ts-expect-error video-react ships without bundled types
import { Player, BigPlayButton } from "video-react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateCompletedLectures } from "../../redux/slices/viewCourseSlice";
import { markLectureAsComplete } from "../../services/operations/courseDetailsAPI";
import type { SubSection } from "../../types/domain";

interface VideoPlayerHandle {
  seek: (time: number) => void;
}

function VideoDetails() {
  const [videoData, setVideoData] = useState<SubSection | null>(null);
  const [previewSource, setPreviewSource] = useState<string>("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { courseId, sectionId, subSectionId } = useParams<{
    courseId: string;
    sectionId: string;
    subSectionId: string;
  }>();
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef<VideoPlayerHandle | null>(null);
  const dispatch = useAppDispatch();
  const { courseSectionData, courseEntireData, completedLectures } =
    useAppSelector((state) => state.viewCourse);

  function isFirstVideo() {
    const sectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );
    const subSectionIndex = courseSectionData[
      sectionIndex
    ]?.subSection?.findIndex((subSection) => subSection._id === subSectionId);
    return subSectionIndex === 0 && sectionIndex === 0;
  }

  const isLastVideo = () => {
    const sectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );
    const subSectionIndex = courseSectionData[
      sectionIndex
    ]?.subSection?.findIndex((subSection) => subSection._id === subSectionId);

    const noOfSubsections = courseSectionData[sectionIndex]?.subSection.length;

    return (
      sectionIndex === courseSectionData.length - 1 &&
      subSectionIndex === (noOfSubsections ?? 0) - 1
    );
  };

  const goToNextVideo = () => {
    const sectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );

    const noOfSubsections = courseSectionData[sectionIndex].subSection.length;

    const subSectionIndex = courseSectionData[
      sectionIndex
    ].subSection.findIndex((subSection) => subSection._id === subSectionId);

    if (subSectionIndex !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[sectionIndex].subSection[subSectionIndex + 1]._id;
      navigate(
        `/viewcourse/${courseId}/section/${sectionId}/subsection/${nextSubSectionId}`
      );
    } else {
      const nextSectionId = courseSectionData[sectionIndex + 1]._id;
      const nextSubSectionId =
        courseSectionData[sectionIndex + 1].subSection[0]._id;
      navigate(
        `/viewcourse/${courseId}/section/${nextSectionId}/subsection/${nextSubSectionId}`
      );
    }
  };

  function goToPrevVideo() {
    const sectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );

    const subSectionIndex = courseSectionData[
      sectionIndex
    ].subSection.findIndex((subSection) => subSection._id === subSectionId);
    if (subSectionIndex !== 0) {
      const prevSubSectionId =
        courseSectionData[sectionIndex].subSection[subSectionIndex - 1]._id;
      navigate(
        `/viewcourse/${courseId}/section/${sectionId}/subsection/${prevSubSectionId}`
      );
    } else {
      const prevSectionId = courseSectionData[sectionIndex - 1]._id;
      const prevSubSectionLength =
        courseSectionData[sectionIndex - 1].subSection.length;
      const prevSubSectionId =
        courseSectionData[sectionIndex - 1].subSection[
          prevSubSectionLength - 1
        ]._id;
      navigate(
        `/viewcourse/${courseId}/section/${prevSectionId}/subsection/${prevSubSectionId}`
      );
    }
  }

  async function handleLectureCompletion() {
    if (!token || !courseId || !subSectionId) return;
    setLoading(true);
    const res = await markLectureAsComplete({ courseId, subSectionId }, token);
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  }

  useEffect(() => {
    function getFirstVideo() {
      if (!courseSectionData.length) return;
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`);
      } else {
        const sectionIndex = courseSectionData.findIndex(
          (section) => section._id === sectionId
        );
        const subSectionIndex = courseSectionData[
          sectionIndex
        ]?.subSection?.findIndex(
          (subSection) => subSection._id === subSectionId
        );

        setVideoData(
          courseSectionData[sectionIndex]?.subSection?.[
            subSectionIndex ?? -1
          ] ?? null
        );
        setPreviewSource(courseEntireData?.thumbnail ?? "");
        setVideoEnded(false);
      }
    }
    getFirstVideo();
  }, [
    courseEntireData,
    courseId,
    courseSectionData,
    location.pathname,
    navigate,
    sectionId,
    subSectionId,
  ]);
  return (
    <>
      <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 px-4 py-6 text-white md:px-8 lg:px-10">
        {!videoData ? (
          <div className="mr-auto w-full max-w-[980px]">
            <img
              src={previewSource}
              alt="Preview"
              className="w-full rounded-xl object-cover"
            />
          </div>
        ) : (
          <div className="mr-auto flex w-full max-w-[980px] flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-richblack-700 bg-black shadow-2xl">
              <Player
                ref={playerRef}
                aspectRatio="16:9"
                playsInline
                autoPlay={true}
                onEnded={() => setVideoEnded(true)}
                src={videoData?.videoURL}
              >
                <BigPlayButton position="center" />
                {videoEnded && (
                  <div
                    style={{
                      backgroundImage:
                        "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                    }}
                    className="absolute inset-0 z-10 flex w-full flex-col items-center justify-center gap-5 font-inter"
                  >
                    {subSectionId &&
                      !completedLectures.includes(subSectionId) && (
                        <button
                          onClick={handleLectureCompletion}
                          className="mx-auto max-w-max rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-black"
                        >
                          {!loading ? "Mark As Completed" : "Loading..."}
                        </button>
                      )}
                    <button
                      onClick={() => {
                        if (playerRef?.current) {
                          playerRef.current.seek(0);
                          setVideoEnded(false);
                        }
                      }}
                      className="mx-auto max-w-max rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-black"
                    >
                      Rewatch
                    </button>

                    <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                      {!isFirstVideo() && (
                        <button
                          disabled={loading}
                          onClick={goToPrevVideo}
                          className="blackButton"
                        >
                          Prev
                        </button>
                      )}
                      {!isLastVideo() && (
                        <button
                          disabled={loading}
                          onClick={goToNextVideo}
                          className="blackButton"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Player>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800/70 p-6 shadow-xl">
              <h1 className="text-3xl font-semibold text-richblack-5">
                {videoData?.title}
              </h1>
              {videoData?.description && (
                <p className="pt-2 text-richblack-200">
                  {videoData.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default VideoDetails;
