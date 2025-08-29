/* eslint-disable @typescript-eslint/no-explicit-any */
import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, beforeEach, vi, Mock} from 'vitest';
import ReplyCard from '@/components/ReplyCard';
import {useCommentsStore} from '@/store';

// mock store
vi.mock('@/store', () => ({
    useCommentsStore: vi.fn(),
}));

// mock child components
vi.mock('@/components/Counter', () => ({
    default: () => <div data-testid="counter" />,
}));
vi.mock('@/components/Button', () => ({
    default: ({name, onClick, disabled}: any) => (
        <button onClick={onClick} disabled={disabled}>
            {name}
        </button>
    ),
}));
vi.mock('@/components/ReplyCardReplyField', () => ({
    default: () => <div data-testid="reply-field">Reply Field</div>,
}));
vi.mock('@/components/DeleteCard', () => ({
    default: () => <div data-testid="delete-card">Delete Modal</div>,
}));
vi.mock('@/utils', () => ({
    timeAgo: () => '1d ago',
}));

describe('ReplyCard', () => {
    const mockUpdateReply = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useCommentsStore as unknown as Mock).mockReturnValue({
            user: {username: 'testuser'},
            updateReply: mockUpdateReply,
            incReplyScore: vi.fn(),
            decReplyScore: vi.fn(),
        });
    });

    const mockReply = {
        id: 1,
        content: 'This is a reply',
        createdAt: new Date(),
        score: 3,
        replyingTo: 'otheruser',
        user: {
            username: 'testuser',
            image: {
                png: '/avatar.png',
                webp: '/avatar.webp',
            },
        },
    };

    it('renders reply content', () => {
        render(<ReplyCard commentId={1} reply={mockReply} />);
        expect(screen.getByText(/This is a reply/)).toBeInTheDocument();
        expect(screen.getByText(/@otheruser/)).toBeInTheDocument();
        expect(screen.getByText(`1d ago`)).toBeInTheDocument();
    });

    it('enters edit mode and saves update', () => {
        render(<ReplyCard commentId={1} reply={mockReply} />);
        fireEvent.click(screen.getByText('Edit'));
        const textarea = screen.getByRole('textbox');
        expect(textarea).toBeInTheDocument();
        fireEvent.change(textarea, {target: {value: 'Updated reply'}});
        fireEvent.click(screen.getByText('Update'));

        expect(mockUpdateReply).toHaveBeenCalledWith(1, 1, 'Updated reply');
    });

    it('toggles reply field', () => {
        const otherReply = {
            ...mockReply,
            user: {
                username: 'someoneelse',
                image: {png: '/avatar.png', webp: '/avatar.webp'},
            },
        };
        render(<ReplyCard commentId={1} reply={otherReply} />);
        fireEvent.click(screen.getByText('Reply'));
        expect(screen.getByTestId('reply-field')).toBeInTheDocument();
    });

    it('toggles delete modal', () => {
        render(<ReplyCard commentId={1} reply={mockReply} />);
        fireEvent.click(screen.getByText('Delete'));
        expect(screen.getByTestId('delete-card')).toBeInTheDocument();
    });
});
