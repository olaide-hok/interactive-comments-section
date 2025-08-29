import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a given date string into a human-readable "time ago" string.
 *
 * The implementation is based on the algorithm described here:
 * https://stackoverflow.com/a/18602474/1869103
 *
 * @param dateString An ISO 8601 date string.
 * @returns A string that describes the given date string as a time period ago.
 */
export function timeAgo(input: Date | string): string {
    const date = input instanceof Date ? input : new Date(input);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date?.getTime()) / 1000);

    const intervals: [number, string][] = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [7, 'day'],
        [4.34524, 'week'], // approx. weeks in a month
        [12, 'month'],
        [Number.MAX_SAFE_INTEGER, 'year'],
    ];

    let count = seconds;
    let unit = 'second';

    for (let i = 0; i < intervals.length; i++) {
        if (count < intervals[i][0]) break;
        count = Math.floor(count / intervals[i][0]);
        unit = intervals[i][1];
    }

    return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
}
