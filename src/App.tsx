import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PolicyClient } from "@prisma/extension-policy";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, Send, Smile } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { prisma } from "../prisma/policy";

declare global {
  // needed to avoid multiple instances when hot-reloading
  var policy: PolicyClient<typeof prisma>;
}

// 1. Create a new PolicyClient instance with the public key
globalThis.policy ??= new PolicyClient<typeof prisma>({
  publicKey:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiMTg3MDQwMjQ3MyJ9.N-8h36Bx5i3OCQzqa6kyDBIYSSqIeahIuCXfe-_GXIx55Oxnf-ZDldRzIonGwX2awFchQWLWLqMXdtETS2s0Bw",
});

type Message = {
  id: string;
  content: string;
  sender?: string;
  createdAt: Date;
};

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [username] = useState("User");
  const [messages, setMessages] = useState<Message[]>([]);
  const viewRef = useRef<HTMLDivElement>(null);

  // 2. Create a new room named "general" if it doesn't exist.
  useMemo(async () => {
    await policy.room.create({ data: { name: "general" } }).catch(() => {
      console.log("This room already exists");
    });
  }, []);

  // 3. Read messages from the room.
  useEffect(() => {
    const interval = setInterval(async () => {
      const messages = await policy.message.findMany({
        where: { roomName: "general" },
        orderBy: { createdAt: "asc" },
      });

      setMessages(messages);
    }, 500);

    return () => clearInterval(interval);
  });

  // 4. Write incoming messages into the database
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");

      await policy.message.create({
        data: {
          content: message,
          roomName: "general",
        },
      });
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    viewRef.current?.scrollTo({
      top: viewRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-svh bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg p-4">
        <h1 className="text-2xl font-bold text-blue-400">Chat with Policy</h1>
      </header>
      <div className="flex flex-col grow">
        <ScrollArea className="flex grow p-4 h-0" viewportRef={viewRef}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 ${
                  message.sender === username ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === username
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p className="font-semibold text-sm mb-1">
                    {message.sender || "Anonymous"}
                  </p>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {message.createdAt.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
        <form
          onSubmit={handleSendMessage}
          className="mt-4 flex space-x-2 p-4 bg-gray-800"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-blue-400"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-blue-400"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
