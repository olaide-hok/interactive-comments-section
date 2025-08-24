'use client';

import Button from './Button';
import {Replies, useCommentsStore} from '@/store';
import Counter from './Counter';
import Image from 'next/image';
import ReplyCardReplyField from './ReplyCardReplyField';
import {useState} from 'react';

interface ReplyCardProps {
    commentId: number;
    reply: Replies;
}
const ReplyCard = ({commentId, reply}: ReplyCardProps) => {
    const {user, toggleDeleteModal} = useCommentsStore();
    const [showReplyField, setShowReplyField] = useState(false);

    return (
        <div className="flex flex-col gap-y-(--sp-200) md:gap-y-(--sp-300)">
            <div className="relative flex flex-col-reverse lg:flex-row bg-(--clr-white) gap-y-(--sp-200) lg:gap-x-(--sp-300) p-(--sp-200) lg:p-(--sp-300) rounded-lg w-[20.3rem] md:w-[40.1rem]">
                {/* Increment and decrement */}
                <Counter score={reply.score} />
                <div className="flex flex-col gap-y-(--sp-200)">
                    {/* avatar, name, date and reply button */}
                    <div className="flex items-center gap-x-(--sp-200)">
                        <Image
                            src={reply.user.image.png}
                            alt="avatar"
                            width={32}
                            height={32}
                        />

                        <div className="flex items-center gap-x-(--sp-100)">
                            <span className="text-(--clr-grey-800) text-(length:--fs-16) font-medium leading-(--lh-150) ">
                                {reply.user.username}
                            </span>

                            {/* User Badge */}
                            {user.username === reply.user.username && (
                                <span className="text-(length:--fs-13) text-(--clr-white) font-medium leading-(--lh-120) bg-(--clr-purple-600) rounded-[0.125rem] w-[2.25rem] h-[1.1875rem] text-center">
                                    you
                                </span>
                            )}
                        </div>

                        <span className="text-(--clr-grey-500) text-(length:--fs-16) leading-(--lh-150) ">
                            {reply.createdAt}
                        </span>
                    </div>

                    {/* reply */}
                    <p className="text-(length:--fs-16) text-(--clr-grey-500) leading-(--lh-150)">
                        <span className="text-(--clr-purple-600) font-medium">
                            @{reply.replyingTo}
                        </span>{' '}
                        {reply.content}
                    </p>
                </div>
                <div className="flex items-center gap-x-(--sp-200) absolute bottom-6 md:bottom-unset sm:top-(--sp-200) right-(--sp-200) h-fit">
                    {user.username === reply.user.username ? (
                        <>
                            <Button
                                name="Delete"
                                variant="deleteIcon"
                                withIcon
                                onClick={toggleDeleteModal}
                            />
                            <Button name="Edit" variant="editIcon" withIcon />
                        </>
                    ) : (
                        <Button
                            name="Reply"
                            variant="replyIcon"
                            withIcon
                            onClick={() => {
                                setShowReplyField((prev) => !prev);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Reply Field */}
            {showReplyField && user.username !== reply.user.username && (
                <ReplyCardReplyField
                    commentId={commentId}
                    replyId={reply.id}
                    setShowReplyField={setShowReplyField}
                />
            )}
        </div>
    );
};

export default ReplyCard;
