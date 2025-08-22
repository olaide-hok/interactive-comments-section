'use client';

import CommentCard from '@/components/CommentCard';
import {useCommentsStore} from '@/store';

export default function Home() {
    const {comments} = useCommentsStore();

    return (
        <div className="flex justify-self-center items-center justify-center py-[2rem] px-(--sp-200) lg:py-[3.62rem] w-[90rem] ">
            <div className=" flex flex-col justify-center gap-y-(--sp-200) md:gap-y-(--sp-300)">
                {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
}
