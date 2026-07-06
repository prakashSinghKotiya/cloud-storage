import { useEffect, useRef, useState } from "react";
import {
  Bot,
  X,
  SendHorizonal,
  Sparkles,
  Loader2,
} from "lucide-react";
import { axiosWithCreds } from "../../api/axios";

// Moved OUTSIDE the component: it doesn't depend on component state/props,
// so it shouldn't be redefined (and definitely shouldn't be `export`ed
// from inside the component body — that's invalid JS).
async function askAi(message) {
  const { data } = await axiosWithCreds.post("/ai", { message });
  return data.aiResponse;
}

export default function AIChatPopup({ open, onClose }) {
  const popupRef = useRef(null);
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm ClouDisk AI. Ask me anything about your files, folders or storage.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!open) return null;

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askAi(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Something went wrong reaching ClouDisk AI. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter to send, Shift+Enter for a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      ref={popupRef}
      className="
      absolute
      right-0
      top-16
      z-50

      w-[380px]
      max-w-[95vw]
      h-[560px]

      rounded-3xl
      border border-white/10
      bg-[#0f131c]/95
      backdrop-blur-2xl

      shadow-2xl
      overflow-hidden

      flex
      flex-col
    "
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
            <Bot size={20} className="text-violet-300" />
          </div>

          <div>
            <h3 className="font-semibold text-white">ClouDisk AI</h3>
            <p className="text-xs text-zinc-400">AI File Assistant</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-white/5"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-5 overflow-y-auto p-5"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-white/5 text-zinc-200"
                  : "bg-violet-600 text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm text-zinc-400">
              <Loader2 size={14} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ClouDisk AI..."
            disabled={loading}
            className="max-h-32 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-zinc-500 disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="
            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-xl
            bg-violet-600

            transition
            hover:bg-violet-500
            disabled:opacity-40
            disabled:hover:bg-violet-600
          "
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <SendHorizonal size={18} />
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <Sparkles size={14} />
          AI responses may not always be accurate.
        </div>
      </div>
    </div>
  );
}
