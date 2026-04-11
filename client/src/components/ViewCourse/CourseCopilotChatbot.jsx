import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { IoSend, IoStop } from "react-icons/io5";

import { askCourseChatbot } from "../../services/operations/courseDetailsAPI";

function normalizeAssistantPayload(payload) {
  if (!payload) {
    return {
      text: "I couldn't generate a response right now. Please try again.",
      source: "",
    };
  }

  let normalizedPayload = payload;

  if (typeof normalizedPayload === "string") {
    try {
      normalizedPayload = JSON.parse(normalizedPayload);
    } catch (error) {
      return {
        text: normalizedPayload,
        source: "",
      };
    }
  }

  if (typeof normalizedPayload !== "object") {
    return {
      text: "I couldn't generate a response right now. Please try again.",
      source: "",
    };
  }

  return {
    text:
      normalizedPayload.answer ||
      normalizedPayload.response ||
      normalizedPayload.reply ||
      normalizedPayload.message ||
      "I couldn't generate a response right now. Please try again.",
    source: normalizedPayload.source || "",
  };
}

function formatAssistantReply(payload) {
  return normalizeAssistantPayload(payload);
}

export default function CourseCopilotChatbot({ courseId, token }) {
  const greetingMessage = useMemo(
    () => ({
      id: "greeting",
      role: "assistant",
      text: "Hi! This is CourseNova AI. I'm here to answer your questions about this course.\n\nWhat would you like help with today?",
      meta: "CourseNova AI · Course Copilot · Just now",
    }),
    []
  );

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([greetingMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserStartedChat, setHasUserStartedChat] = useState(false);
  const abortControllerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isLoading, messages]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsOpen(false);
    setInput("");
    setIsLoading(false);
  };

  const handleStopResponse = () => {
    if (!abortControllerRef.current) {
      return;
    }

    abortControllerRef.current.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `assistant-stop-${Date.now()}`,
        role: "assistant",
        text: "Stopped the current response. You can ask a new question anytime.",
        meta: "CourseNova AI · Course Copilot · Just now",
      },
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedQuery = input.trim();

    if (!trimmedQuery || isLoading) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmedQuery,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setHasUserStartedChat(true);
    setInput("");
    setIsLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const result = await askCourseChatbot(
      {
        course_id: courseId,
        user_query: trimmedQuery,
      },
      token,
      controller.signal
    );

    if (result?.cancelled) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        ...formatAssistantReply(result),
        meta: "CourseNova AI · Course Copilot · Just now",
      },
    ]);
    abortControllerRef.current = null;
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[140] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[620px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[30px] border border-richblack-700 bg-richblack-800 shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-3 border-b border-richblack-700 px-5 py-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-richblue-300 bg-richblack-700 text-richblue-25">
              <HiOutlineSparkles className="text-xl" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold text-richblack-5">
                Ask CourseNova AI
              </p>
              <p className="text-xs text-richblack-300">
                Course Copilot
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-richblack-200 transition-all duration-200 hover:bg-richblack-700 hover:text-richblack-5"
            >
              <IoMdClose className="text-xl" />
            </button>
          </div>

          <div
            ref={messagesContainerRef}
            className="thin-dark-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[88%]">
                  <div
                    className={`rounded-[22px] px-4 py-3 text-sm leading-7 ${
                      message.role === "assistant"
                        ? "bg-richblack-700 text-richblack-5"
                        : "bg-richblue-400 text-white"
                    }`}
                  >
                    {message.text.split("\n").map((line, index) => (
                      <p key={`${message.id}-${index}`}>{line}</p>
                    ))}
                    {message.role === "assistant" && message.source && (
                      <div className="mt-3 rounded-2xl border border-richblack-600 bg-richblack-800/70 px-3 py-2 text-xs leading-6 text-richblack-100">
                        <span className="font-semibold text-richblack-25">
                          Source:
                        </span>{" "}
                        {message.source}
                      </div>
                    )}
                  </div>
                  {message.meta && (
                    <p className="px-2 pt-2 text-xs text-richblack-400">
                      {message.meta}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[88%]">
                  <div className="rounded-[22px] bg-richblack-700 px-4 py-3 text-sm text-richblack-100">
                    <div className="mb-2">CourseNova AI is thinking</div>
                    <div className="copilot-thinking-dots" aria-label="Thinking">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <p className="px-2 pt-2 text-xs text-richblack-400">
                    CourseNova AI · Course Copilot · Just now
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-richblack-700 bg-richblack-800 px-4 py-4"
          >
            <div className="flex items-center gap-3 rounded-[24px] border border-richblack-600 bg-richblack-700 px-4 py-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent text-sm text-richblack-5 outline-none placeholder:text-richblack-400"
              />
              {isLoading ? (
                <button
                  type="button"
                  onClick={handleStopResponse}
                  className="grid h-10 w-10 place-items-center rounded-full bg-pink-200 text-richblack-900 transition-all duration-200 hover:bg-pink-100"
                  aria-label="Stop response"
                >
                  <IoStop className="text-lg" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="grid h-10 w-10 place-items-center rounded-full bg-richblue-400 text-white transition-all duration-200 hover:bg-richblue-300 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <IoSend className="text-lg" />
                </button>
              )}
            </div>
            {!hasUserStartedChat && !isLoading && (
              <p className="px-2 pt-3 text-xs text-richblack-400">
                Ask doubts about concepts, lecture notes, or this course content.
              </p>
            )}
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        className="grid h-16 w-16 place-items-center rounded-full bg-richblue-400 text-white shadow-[0_16px_40px_rgba(45,90,106,0.45)] transition-all duration-200 hover:scale-95 hover:bg-richblue-300"
        aria-label="Open course copilot"
      >
        <HiOutlineSparkles className="text-2xl" />
      </button>
    </div>
  );
}

CourseCopilotChatbot.propTypes = {
  courseId: PropTypes.string.isRequired,
  token: PropTypes.string,
};
