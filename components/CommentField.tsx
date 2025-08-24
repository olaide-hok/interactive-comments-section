import Image from 'next/image';
import Button from './Button';

const CommentField = () => {
    return (
        <div className="flex flex-col md:flex-row items-start justify-center gap-y-(--sp-200) gap-x-(--sp-200) bg-(--clr-white) p-(--sp-200) md:p-(--sp-300) rounded-lg w-full lg:w-[45.6rem]">
            <Image
                className="hidden md:block"
                src="/avatars/image-juliusomo.png"
                alt="avatar"
                height={40}
                width={40}
            />
            {/* TextArea */}
            <textarea
                name="comment"
                id="comment"
                className="resize-none text-(--clr-grey-800) placeholder:text-(--clr-grey-500) text-(length:--fs-16) leading-(--lh-150) px-(--sp-200) py-(--sp-100) border border-(--clr-grey-100) focus:outline-(--clr-purple-600) rounded-lg w-full lg:w-[31.625rem] min-h-[6rem] caret-(--clr-purple-600)"
                placeholder="Add a comment..."></textarea>
            <div className="flex items-center justify-between w-full md:hidden">
                {/* Avatar */}
                <Image
                    className=""
                    src="/avatars/image-juliusomo.png"
                    alt="avatar"
                    height={32}
                    width={32}
                />

                {/* Send Button */}
                <Button className="" name="Send" variant="reply" />
            </div>
            {/* Send Button */}
            <Button className="hidden md:block" name="Send" variant="reply" />
        </div>
    );
};

export default CommentField;
