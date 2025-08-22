import Button from './Button';

const DeleteCard = () => {
    return (
        <div className="flex flex-col bg-(--clr-white) gap-y-(--sp-300) p-8 rounded-lg w-[25rem]">
            <h2 className="text-(--clr-grey-800) text(length:--fs-24) leading-(--lh-120)">
                Delete comment
            </h2>

            <p className="text-(--clr-grey-500) text(length:--fs-16) leading-(--lh-150)">
                Are you sure you want to delete this comment? This will remove
                the comment and can’t be undone.
            </p>

            <div className="flex gap-x-(--sp-200)">
                <Button name="No, Cancel" variant="noCancel" />
                <Button name="Yes, Delete" variant="yesDelete" />
            </div>
        </div>
    );
};

export default DeleteCard;
