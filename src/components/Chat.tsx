"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Chat() {
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    error,
  } = useChat({
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
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-bold">
              👋 Welcome to AI Lead Scorer
            </h2>

            <p className="mt-2 text-gray-500">
              Ask me to score a lead or try the example below.
            </p>

            <button
              onClick={() =>
                setInput(
                  "Score Acme Inc with 120 employees and a budget of 20000"
                )
              }
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Example
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              Something went wrong.
            </p>

            <p className="mt-1 text-sm text-red-600">
              Please try again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
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

                    case "output-available": {
                      const output = part.output as any;

                      return (
                        <div
                          key={index}
                          className="mt-2 rounded-lg border bg-green-50 p-4"
                        >
                          <h3 className="font-bold">📊 Lead Score</h3>

                          <p>
                            <strong>Company:</strong> {output.company}
                          </p>
                          <p>
                            <strong>Score:</strong> {output.score}/100
                          </p>
                          <p>
                            <strong>Priority:</strong> {output.priority}
                          </p>
                          <p>
                            <strong>Reason:</strong> {output.reason}
                          </p>
                        </div>
                      );
                    }

                    case "output-error":
                      return (
                        <div
                          key={index}
                          className="mt-2 rounded-lg bg-red-100 p-3 text-red-700"
                        >
                          ❌ Failed to score lead.
                        </div>
                      );

                    default:
                      return null;
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