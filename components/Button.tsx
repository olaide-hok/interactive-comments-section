import {cn} from '@/utils';
import {Icons} from './Icons';

interface ButtonProps {
    name: string;
    variant:
        | 'noCancel'
        | 'yesDelete'
        | 'reply'
        | 'replyIcon'
        | 'deleteIcon'
        | 'editIcon';
    withIcon?: boolean;
}

const Button = ({
    name,
    className,
    withIcon = false,
    variant,
    ...props
}: React.ComponentProps<'button'> & ButtonProps) => {
    const variants = {
        noCancel:
            'bg-(--clr-grey-500) text-(--clr-white) text-center h-[3rem] w-[10.0625rem]',
        yesDelete:
            'bg-(--clr-pink-400) text-(--clr-white) text-center h-[3rem] w-[10.0625rem] ',
        reply: 'bg-(--clr-purple-600) hover:bg-(--clr-purple-200) font-medium text-(--clr-white) py-3 w-[6.5rem]',
        replyIcon: 'text-(--clr-purple-600) hover:text-(--clr-purple-200)',
        deleteIcon: 'text-(--clr-pink-400) hover:text-(--clr-pink-200)',
        editIcon: 'text-(--clr-purple-600) hover:text-(--clr-purple-200)',
    };

    if (withIcon) {
        return (
            <button
                className={cn(
                    `${variants[variant]} ${className} text-base font-medium ${
                        props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    } inline-flex items-center gap-(--sp-100)`
                )}
                {...props}>
                {variant === 'replyIcon' && (
                    <Icons.reply className="fill-current" />
                )}
                {variant === 'deleteIcon' && (
                    <Icons.delete className="fill-current" />
                )}
                {variant === 'editIcon' && (
                    <Icons.edit className="fill-current" />
                )}
                {name}
            </button>
        );
    }

    return (
        <button
            className={cn(
                `${variants[variant]} ${className} uppercase rounded-lg outline-none cursor-pointer`
            )}
            {...props}>
            {name}
        </button>
    );
};

export default Button;
