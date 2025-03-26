import { Message } from "@/types";
import { FC } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";

interface Props {
    messages: Message[];
    loading: boolean;
    onSend: (message: Message) => void;
    onReset: () => void;
    onAbort: () => void;
}

export const Chat: FC<Props> = ({ messages, loading, onSend, onReset, onAbort }) => {
    return (
        <>
            <div className="bottom-0 left-0 w-full">
                <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className="my-1 sm:my-1.5"
                        >
                            <ChatMessage message={message} />
                        </div>
                    ))}

                    {loading && (
                        <div className="my-1 sm:my-1.5">
                            <ChatLoader />
                        </div>
                    )}
                </div>

                <div className="fixed flex-1 w-full max-w-[800px] mx-auto mt-2 px-3 sm:px-0 bottom-0"
                     style={{ boxShadow: "0 -20px 180px rgba(0, 0, 0, 0.085)"}}>
                    <ChatInput onSend={onSend} />
                </div>
            </div>
        </>
    );
};