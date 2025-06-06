import { FC } from "react";

interface Props {
    onReset: () => void;
    onAbort: () => void;
}

export const ResetChat: FC<Props> = ({ onReset, onAbort }) => {
    return (
        <div className="flex flex-row items-center">
            <button
                className="text-sm sm:text-base text-neutral-900 font-semibold rounded-lg px-4 py-2 bg-neutral-200 hover:bg-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300 select-none"
                onClick={() => onReset()}
            >
                清理
            </button>
        </div>
    );
};
;