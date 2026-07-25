"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({
    api: "/api/chat",
  }),

  maxSteps: 5,
});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      text: input,
    });

    setInput("");
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Streaming AI Chat
      </h1>

      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500">
            Start a conversation...
          </p>
        )}

        {messages.map((message) => (
          <div key={message.id}>
            <strong>
              {message.role === "user" ? "You" : "AI"}:
            </strong>{" "}
            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return <span key={index}>{part.text}</span>;
              }
              return null;
            })}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />

        <button
          type="submit"
          disabled={status !== "ready"}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {status === "submitted" || status === "streaming"
            ? "Thinking..."
            : "Send"}
        </button>
      </form>
    </main>
  );
}