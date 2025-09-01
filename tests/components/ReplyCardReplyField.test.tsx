import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, Mock} from 'vitest';
import ReplyCardReplyField from '@/components/ReplyCardReplyField';
import {useCommentsStore} from '@/store';

// ✅ Mock the store
vi.mock('@/store', () => ({
    useCommentsStore: vi.fn(),
}));

describe('ReplyCardReplyField', () => {
    const mockReplyReply = vi.fn();
    const mockSetShowReplyField = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useCommentsStore as unknown as Mock).mockReturnValue({
            replyReply: mockReplyReply,
        });
    });

    it('renders textarea and reply button', () => {
        render(
            <ReplyCardReplyField
                commentId={1}
                replyId={1}
                setShowReplyField={mockSetShowReplyField}
            />
        );

        expect(
            screen.getByPlaceholderText(/add a comment/i)
        ).toBeInTheDocument();
        expect(
            screen.getAllByRole('button', {name: /reply/i}).length
        ).toBeGreaterThan(0);
    });

    it('updates textarea when typing', () => {
        render(
            <ReplyCardReplyField
                commentId={2}
                replyId={2}
                setShowReplyField={mockSetShowReplyField}
            />
        );

        const textarea = screen.getByPlaceholderText(
            /add a comment/i
        ) as HTMLTextAreaElement;
        fireEvent.change(textarea, {target: {value: 'Hello reply'}});

        expect(textarea.value).toBe('Hello reply');
    });

    it('calls replyReply with trimmed text and clears textarea', () => {
        render(
            <ReplyCardReplyField
                commentId={3}
                replyId={3}
                setShowReplyField={mockSetShowReplyField}
            />
        );

        const textarea = screen.getByPlaceholderText(
            /add a comment/i
        ) as HTMLTextAreaElement;
        const replyButton = screen.getAllByRole('button', {name: /reply/i})[0];

        fireEvent.change(textarea, {target: {value: '   My reply text   '}});
        fireEvent.click(replyButton);

        expect(mockReplyReply).toHaveBeenCalledWith(3, 3, 'My reply text');
        expect(textarea.value).toBe('');
        expect(mockSetShowReplyField).toHaveBeenCalledWith(false);
    });

    it('hides reply field without calling replyReply when reply is empty', () => {
        render(
            <ReplyCardReplyField
                commentId={4}
                replyId={4}
                setShowReplyField={mockSetShowReplyField}
            />
        );

        const replyButton = screen.getAllByRole('button', {name: /reply/i})[0];
        fireEvent.click(replyButton);

        expect(mockReplyReply).not.toHaveBeenCalled();
        expect(mockSetShowReplyField).toHaveBeenCalledWith(false);
    });
});
