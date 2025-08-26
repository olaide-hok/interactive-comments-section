'use client';

import Image from 'next/image';
import {useCommentsStore} from '@/store';

interface CounterProps {
    score: number;
    type: 'comment-card' | 'reply-card';
    commentId: number;
    replyId?: number;
    incCommentScore?: (commentId: number) => void;
    decCommentScore?: (commentId: number) => void;
    isOwner: boolean;
}

const Counter = ({
    score,
    type,
    commentId,
    incCommentScore,
    decCommentScore,
    isOwner,
}: CounterProps) => {
    const {votes, user} = useCommentsStore();
    const currentVote = votes[commentId]?.[user.username] ?? 0;

    const increment = () => {
        if (isOwner) return;

        if (currentVote === 1) return;

        if (type === 'comment-card' && incCommentScore) {
            incCommentScore(commentId);
        }
    };

    const decrement = () => {
        if (isOwner) return;

        if (currentVote === -1) return;

        if (type === 'comment-card' && decCommentScore) {
            decCommentScore(commentId);
        }
    };

    return (
        <div className="flex lg:flex-col items-center justify-center bg-(--clr-grey-50) gap-(--sp-200) rounded-[0.625rem] w-[6.25rem] h-[2.5rem] lg:px-[0.31rem] lg:py-[0.835rem] lg:w-[2.5rem] lg:h-[6.25rem]">
            <button
                type="button"
                aria-label="Increment"
                onClick={increment}
                className={
                    isOwner || currentVote === 1
                        ? `cursor-not-allowed`
                        : `cursor-pointer`
                }
                disabled={isOwner || currentVote === 1}>
                <Image src="/icon-plus.svg" alt="plus" width={12} height={12} />
            </button>
            <span className="text-(--clr-purple-600) text-(length:--fs-16) font-medium leading-(--lh-150)">
                {score}
            </span>
            <button
                type="button"
                aria-label="Decrement"
                onClick={decrement}
                className={
                    score === 0 || isOwner || currentVote === -1
                        ? `cursor-not-allowed`
                        : `cursor-pointer`
                }
                disabled={score === 0 || isOwner || currentVote === -1}>
                <Image
                    src="/icon-minus.svg"
                    alt="minus"
                    width={12}
                    height={12}
                />
            </button>
        </div>
    );
};

export default Counter;
