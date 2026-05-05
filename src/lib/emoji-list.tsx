"use client";

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip";

export interface EmojiItem {
    name: string;
    emoji?: string;
    shortcodes: string[];
    fallbackImage?: string;
}

export interface EmojiListHandle {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface EmojiListProps {
    items: EmojiItem[];
    command: (item: { name: string }) => void;
}

const EmojiList = forwardRef<EmojiListHandle, EmojiListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) props.command({ name: item.name });
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown({ event }) {
            if (event.key === "ArrowUp") {
                setSelectedIndex((i) => (i + props.items.length - 1) % props.items.length);
                return true;
            }
            if (event.key === "ArrowDown") {
                setSelectedIndex((i) => (i + 1) % props.items.length);
                return true;
            }
            if (event.key === "Enter") {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    if (!props.items.length) return null;

    return (
        <div className="z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md">
            {props.items.map((item, index) => (
                <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => selectItem(index)}
                            className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none ${index === selectedIndex
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted"
                                }`}
                        >
                            {item.fallbackImage ? (
                                <img src={item.fallbackImage} alt={item.name} width={18} height={18} />
                            ) : (
                                <span className="text-base leading-none">{item.emoji}</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                                :{item.shortcodes[0]}:
                            </span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">
                        {item.name.replace(/_/g, " ")}
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
});

EmojiList.displayName = "EmojiList";
export default EmojiList;