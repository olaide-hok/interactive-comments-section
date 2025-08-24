import {useCommentsStore} from '@/store';
import Button from './Button';

interface DeleteCardProps {
    commentId: number;
    replyId: number;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteCard = ({
    commentId,
    replyId,
    setShowDeleteModal,
}: DeleteCardProps) => {
    const {deleteReply} = useCommentsStore();

    const handleDelete = (commentId: number, replyId: number) => {
        if (replyId) {
            deleteReply(commentId, replyId);
        }
        setShowDeleteModal(false);
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-(--clr-black)/50 flex items-center justify-center z-10 px-(--sp-200)">
            <div className="flex flex-col bg-(--clr-white) gap-y-(--sp-200) md:gap-y-(--sp-300) p-(--sp-300) md:p-8 rounded-lg w-[21.4375rem] md:w-[25rem]">
                <h2 className="text-(--clr-grey-800) text-(length:--fs-24) font-medium leading-(--lh-120)">
                    Delete comment
                </h2>
                <p className="text-(--clr-grey-500) text(length:--fs-16) leading-(--lh-150)">
                    Are you sure you want to delete this comment? This will
                    remove the comment and can&apos;t be undone.
                </p>
                <div className="flex gap-x-(--sp-200)">
                    <Button
                        name="No, Cancel"
                        variant="noCancel"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    <Button
                        name="Yes, Delete"
                        variant="yesDelete"
                        onClick={() => handleDelete(commentId, replyId)}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeleteCard;
