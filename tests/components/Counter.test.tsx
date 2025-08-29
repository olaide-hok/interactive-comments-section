import {SVGProps} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import Counter from '@/components/Counter';

type IconProps = SVGProps<SVGSVGElement>;

// 🛠 mock Icons (so tests don’t fail on SVGs)
vi.mock('@/components/Icons', () => ({
    Icons: {
        plus: (props: IconProps) => <svg data-testid="plus-icon" {...props} />,
        minus: (props: IconProps) => (
            <svg data-testid="minus-icon" {...props} />
        ),
    },
}));

// 🛠 mock useCommentsStore
vi.mock('@/store', () => ({
    useCommentsStore: vi.fn(() => ({
        votes: {
            comment1: {testuser: 0},
            reply1: {testuser: 0},
        },
        user: {username: 'testuser'},
    })),
}));

describe('Counter', () => {
    it('renders score', () => {
        render(
            <Counter
                score={5}
                type="comment-card"
                commentId={1}
                incCommentScore={vi.fn()}
                decCommentScore={vi.fn()}
                isOwner
            />
        );

        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
        expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
    });

    it('calls incCommentScore when increment clicked', () => {
        const incCommentScore = vi.fn();
        render(
            <Counter
                score={1}
                type="comment-card"
                commentId={1}
                incCommentScore={incCommentScore}
                decCommentScore={vi.fn()}
                isOwner={false}
            />
        );

        fireEvent.click(screen.getByRole('button', {name: /increment/i}));
        expect(incCommentScore).toHaveBeenCalledWith(1);
    });

    it('calls decCommentScore when decrement clicked', () => {
        const decCommentScore = vi.fn();
        render(
            <Counter
                score={2}
                type="comment-card"
                commentId={2}
                incCommentScore={vi.fn()}
                decCommentScore={decCommentScore}
                isOwner={false}
            />
        );

        fireEvent.click(screen.getByRole('button', {name: /decrement/i}));
        expect(decCommentScore).toHaveBeenCalledWith(2);
    });

    it('does not increment if isOwner', () => {
        const incCommentScore = vi.fn();
        render(
            <Counter
                score={10}
                type="comment-card"
                commentId={4}
                incCommentScore={incCommentScore}
                decCommentScore={vi.fn()}
                isOwner
            />
        );

        fireEvent.click(screen.getByRole('button', {name: /increment/i}));
        expect(incCommentScore).not.toHaveBeenCalled();
    });

    it('calls incReplyScore when incrementing reply-card', () => {
        const incReplyScore = vi.fn();
        render(
            <Counter
                score={3}
                type="reply-card"
                commentId={2}
                replyId={1}
                incReplyScore={incReplyScore}
                decReplyScore={vi.fn()}
                isOwner={false}
            />
        );

        fireEvent.click(screen.getByRole('button', {name: /increment/i}));
        expect(incReplyScore).toHaveBeenCalledWith(2, 1);
    });

    it('disables decrement when score is 0', () => {
        render(
            <Counter
                score={0}
                type="comment-card"
                commentId={6}
                incCommentScore={vi.fn()}
                decCommentScore={vi.fn()}
                isOwner
            />
        );

        const decBtn = screen.getByRole('button', {name: /decrement/i});
        expect(decBtn).toBeDisabled();
    });
});
