import { FC } from "react";
import { ResetChat } from "../Chat/ResetChat";

interface Props {
    onReset: () => void;
    onAbort: () => void;
}

export const Navbar: FC<Props> = ({ onReset, onAbort }) => {
    return (
        <div className="flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between select-none">
            <div className="font-bold text-3xl flex items-center">
                <a
                    className="ml-2 hover:opacity-50"
                    href="https://user.qzone.qq.com/992073172"
                >
                    Ollama
                </a>
            </div>
            <ResetChat onReset={onReset} onAbort={onAbort}/>
        </div>
    );
};
