import Image from 'next/image';
import Counter from './Counter';
import Button from './Button';
import {Comment} from '../store';
import ReplyCard from './ReplyCard';

interface CommentProps {
    comment: Comment;
}

const CommentCard = ({comment}: CommentProps) => {
    return (
        <div className="flex flex-col">
            <div className="relative flex flex-col-reverse lg:flex-row bg-(--clr-white) gap-y-(--sp-200) lg:gap-x-(--sp-300) p-(--sp-200) lg:p-(--sp-300) rounded-lg w-[21.4375rem] md:w-full lg:h-[10.4375rem]">
                {/* Increment and decrement */}
                <Counter score={comment.score} />
                <div className="flex flex-col gap-y-(--sp-200)">
                    {/* avatar, name, date and reply button */}
                    <div className="flex items-center gap-x-(--sp-200)">
                        <Image
                            src={comment.user.image.png}
                            alt="avatar"
                            width={32}
                            height={32}
                        />

                        <span className="text-(--clr-grey-800) text-(length:--fs-16) font-medium leading-(--lh-150) ">
                            {comment.user.username}
                        </span>

                        <span className="text-(--clr-grey-500) text-(length:--fs-16) leading-(--lh-150) ">
                            {comment.createdAt}
                        </span>
                    </div>

                    {/* comment */}
                    <p className="text-(--clr-grey-400) leading-(--lh-150)">
                        {comment.content}
                    </p>
                </div>
                <Button
                    className="absolute bottom-(--sp-200) md:bottom-unset sm:top-(--sp-200) right-(--sp-200) h-fit"
                    name="Reply"
                    variant="replyIcon"
                    withIcon
                />
            </div>
            {/* Replies */}
            <div
                className={`flex flex-col gap-y-(--sp-200) md:gap-y-(--sp-300) border-l-2 border-(--clr-grey-100) pl-(--sp-200) md:pl-(--sp-500) md:ml-[2.87rem] ${
                    comment.replies.length > 0 &&
                    'my-(--sp-200) md:my-(--sp-300)'
                } `}>
                {comment.replies.length > 0 &&
                    comment.replies.map((reply) => (
                        <ReplyCard key={reply.id} reply={reply} />
                    ))}
            </div>
        </div>
    );
};

export default CommentCard;
