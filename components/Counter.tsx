'use client';
import Image from 'next/image';
import {useState} from 'react';

interface CounterProps {
    score: number;
}

const Counter = ({score}: CounterProps) => {
    const [count, setCount] = useState(score);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return (
        <div className="flex lg:flex-col items-center justify-center bg-(--clr-grey-50) lg:py-(--sp-200) gap-(--sp-200) rounded-[0.625rem] w-[6.25rem] h-[2.5rem] lg:w-[2.5rem] lg:h-[6.25rem]">
            <button
                type="button"
                aria-label="Increment"
                onClick={increment}
                className="cursor-pointer">
                <Image src="/icon-plus.svg" alt="plus" width={12} height={12} />
            </button>
            <span className="text-(--clr-purple-600) text-(length:--fs-16) font-medium leading-(--lh-150)">
                {count}
            </span>
            <button
                type="button"
                aria-label="Decrement"
                onClick={decrement}
                className="cursor-pointer">
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
