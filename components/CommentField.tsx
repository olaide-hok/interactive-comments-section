import Image from 'next/image';
import Button from './Button';

const CommentField = () => {
    return (
        <div className="flex items-start gap-x-(--sp-200) bg-(--clr-white)  p-(--sp-300) rounded-lg">
            {/* Avatar */}
            <Image
                src="/avatars/image-juliusomo.png"
                alt="avatar"
                width={32}
                height={32}
            />
            {/* TextArea */}
            <textarea
                name="comment"
                id="comment"
                className="resize-none text-(--clr-grey-800) placeholder:text-(--clr-grey-500) text-(length:--fs-16) leading-(--lh-150) px-(--sp-200) py-(--sp-100) border border-(--clr-grey-100) focus:outline-(--clr-purple-600) rounded-lg w-[31.625rem] h-[6rem] caret-(--clr-purple-600)"
                placeholder="Add a comment..."></textarea>
            {/* Send Button */}
            <Button name="Send" variant="reply" />
        </div>
    );
};

export default CommentField;
