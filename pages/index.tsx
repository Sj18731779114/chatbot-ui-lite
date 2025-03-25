import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConfig = async () => {
    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error("Failed to load config.json");
    }
    (window as any).globalConfig = await response.json();
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const config = (window as any).globalConfig;

    const response = await fetch(config.LLM_HOST + "/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": config.model,
        "messages": [{"role": message.role, "content": message.content}],
        "stream": true,
        "prompt": "hello"
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      let _chunkValue_content = "";

      let buffer = chunkValue;
      {
        // 按换行符分割完整 JSON 行
        const lines = buffer.split(/\r?\n/);
        for(const line of lines)
        {
          if(line.length > 2)
          {
            let obj = JSON.parse(line);
            let content = obj.message.content;
            _chunkValue_content = content;
          }
        }
      }

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: _chunkValue_content
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + _chunkValue_content
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  const INITIAL_MESSAGE: Message = {
    role: "assistant",
    content: `你好！我可以帮助你回答问题，提供信息，帮助你完成任务。我能为您做些什么？`
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const handleAbort = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([INITIAL_MESSAGE]);
  }, []);

  useEffect(() => {
    loadConfig();
  });

  return (
      <>
        <Head>
          <title>Ollama</title>
          <meta
              name="description"
              content="A simple chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS."
          />
          <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
          />
          <link
              rel="icon"
              href="/favicon.ico"
          />
        </Head>

        <div className="flex flex-col h-screen">
          <Navbar
              onReset={handleReset}
              onAbort={handleAbort}
          />

          <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
            <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
              <Chat
                  messages={messages}
                  loading={loading}
                  onSend={handleSend}
                  onReset={handleReset}
                  onAbort={handleAbort}
              />
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </>
  );
}
