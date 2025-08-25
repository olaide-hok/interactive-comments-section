'use client';

import CommentCard from '@/components/CommentCard';
import CommentField from '@/components/CommentField';
import {useCommentsStore} from '@/store';

export default function Home() {
    const {comments} = useCommentsStore();

    return (
        <div className="flex flex-col justify-self-center items-center justify-center py-[2rem] px-(--sp-200) lg:py-[3.62rem] lg:w-[90rem]">
            <div className=" flex flex-col justify-center gap-y-(--sp-200) md:gap-y-(--sp-300) lg:w-[45.6rem]">
                {comments.map((comment, index) => (
                    <CommentCard key={comment.id + index} comment={comment} />
                ))}
            </div>
            {/* Comment Field */}
            <CommentField />
        </div>
    );
}
