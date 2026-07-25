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
  switch (part.type) {
    case "text":
      return <span key={index}>{part.text}</span>;

    case "tool-leadScore":
      switch (part.state) {
        case "input-streaming":
          return (
            <div
              key={index}
              className="mt-2 rounded-lg bg-yellow-100 p-3"
            >
              ⏳ Scoring lead...
            </div>
          );

        case "input-available":
          return (
            <div
              key={index}
              className="mt-2 rounded-lg bg-blue-100 p-3"
            >
              📋 Processing lead information...
            </div>
          );

        case "output-available":
          return (
            <div
              key={index}
              className="mt-2 rounded-lg border bg-green-50 p-4"
            >
              <h3 className="font-bold">
                📊 Lead Score
              </h3>

              <p>
                <strong>Company:</strong>{" "}
                {part.output.company}
              </p>

              <p>
                <strong>Score:</strong>{" "}
                {part.output.score}/100
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                {part.output.priority}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {part.output.reason}
              </p>
            </div>
          );

        case "output-error":
          return (
            <div
              key={index}
              className="mt-2 rounded-lg bg-red-100 p-3 text-red-700"
            >
              ❌ Failed to score lead.
            </div>
          );
      }

    default:
      return null;
  }
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