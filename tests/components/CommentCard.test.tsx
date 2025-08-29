/* eslint-disable @typescript-eslint/no-explicit-any */
import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import CommentCard from '@/components/CommentCard';

// Mock child components to isolate CommentCard
vi.mock('@/components/Counter', () => ({
    default: ({incCommentScore, decCommentScore}: any) => (
        <div>
            <button onClick={incCommentScore}>+</button>
            <button onClick={decCommentScore}>-</button>
        </div>
    ),
}));

vi.mock('@/components/Button', () => ({
    default: ({name, onClick}: any) => (
        <button onClick={onClick}>{name}</button>
    ),
}));

vi.mock('@/components/ReplyCard', () => ({
    default: ({reply}: any) => <div>{reply.content}</div>,
}));

vi.mock('@/components/CommentCardReplyField', () => ({
    default: () => <div>Reply Field</div>,
}));

// Mock timeAgo utility
vi.mock('@/utils', () => ({
    timeAgo: () => '2 days ago',
}));

describe('CommentCard', () => {
    const baseComment = {
        id: 1,
        content: 'This is a test comment',
        createdAt: new Date(),
        score: 5,
        user: {
            username: 'JohnDoe',
            image: {
                png: '/avatar.png',
                webp: '/avatar.webp',
            },
        },
        replies: [],
    };

    const mockInc = vi.fn();
    const mockDec = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders comment details', () => {
        render(
            <CommentCard
                comment={baseComment}
                incScore={mockInc}
                decScore={mockDec}
                user="JaneDoe"
            />
        );

        expect(screen.getByText('JohnDoe')).toBeInTheDocument();
        expect(screen.getByText('This is a test comment')).toBeInTheDocument();
        expect(screen.getByText('2 days ago')).toBeInTheDocument();
    });

    it('calls incScore and decScore when buttons are clicked', () => {
        render(
            <CommentCard
                comment={baseComment}
                incScore={mockInc}
                decScore={mockDec}
                user="JaneDoe"
            />
        );

        fireEvent.click(screen.getByText('+'));
        fireEvent.click(screen.getByText('-'));

        expect(mockInc).toHaveBeenCalled();
        expect(mockDec).toHaveBeenCalled();
    });

    it('toggles the reply field when Reply button is clicked', () => {
        render(
            <CommentCard
                comment={baseComment}
                incScore={mockInc}
                decScore={mockDec}
                user="JaneDoe"
            />
        );

        const replyButton = screen.getByText('Reply');

        // Initially not visible
        expect(screen.queryByText('Reply Field')).not.toBeInTheDocument();

        fireEvent.click(replyButton);
        expect(screen.getByText('Reply Field')).toBeInTheDocument();

        fireEvent.click(replyButton);
        expect(screen.queryByText('Reply Field')).not.toBeInTheDocument();
    });

    it('renders replies if present', () => {
        const commentWithReplies = {
            ...baseComment,
            replies: [
                {
                    id: 101,
                    content: 'First reply',
                    createdAt: new Date(),
                    score: 0,
                    replyingTo: 'JohnDoe',
                    user: {
                        image: {
                            png: '/avatar.png',
                            webp: '/avatar.webp',
                        },
                        username: 'JaneDoe',
                    },
                },
                {
                    id: 102,
                    content: 'Second reply',
                    createdAt: new Date(),
                    score: 0,
                    replyingTo: 'JohnDoe',
                    user: {
                        image: {
                            png: '/avatar.png',
                            webp: '/avatar.webp',
                        },
                        username: 'JaneDoe',
                    },
                },
            ],
        };

        render(
            <CommentCard
                comment={commentWithReplies}
                incScore={mockInc}
                decScore={mockDec}
                user="JaneDoe"
            />
        );

        expect(screen.getByText('First reply')).toBeInTheDocument();
        expect(screen.getByText('Second reply')).toBeInTheDocument();
    });
});
