import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, Mock} from 'vitest';
import CommentCardReplyField from '@/components/CommentCardReplyField';
import {useCommentsStore} from '@/store';

// ✅ Mock the store
vi.mock('@/store', () => ({
    useCommentsStore: vi.fn(),
}));

describe('CommentCardReplyField', () => {
    const mockReplyComment = vi.fn();
    const mockSetShowCommentReplyField = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useCommentsStore as unknown as Mock).mockReturnValue({
            replyComment: mockReplyComment,
        });
    });

    it('renders textarea and reply button', () => {
        render(
            <CommentCardReplyField
                commentId={1}
                setShowCommentReplyField={mockSetShowCommentReplyField}
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
            <CommentCardReplyField
                commentId={2}
                setShowCommentReplyField={mockSetShowCommentReplyField}
            />
        );

        const textarea = screen.getByPlaceholderText(
            /add a comment/i
        ) as HTMLTextAreaElement;
        fireEvent.change(textarea, {target: {value: 'Hello comment'}});

        expect(textarea.value).toBe('Hello comment');
    });

    it('calls replyComment with trimmed text and clears textarea', () => {
        render(
            <CommentCardReplyField
                commentId={3}
                setShowCommentReplyField={mockSetShowCommentReplyField}
            />
        );

        const textarea = screen.getByPlaceholderText(
            /add a comment/i
        ) as HTMLTextAreaElement;
        const replyButton = screen.getAllByRole('button', {name: /reply/i})[0];

        fireEvent.change(textarea, {target: {value: '   My comment text   '}});
        fireEvent.click(replyButton);

        expect(mockReplyComment).toHaveBeenCalledWith(3, 'My comment text');
        expect(textarea.value).toBe('');
        expect(mockSetShowCommentReplyField).toHaveBeenCalledWith(false);
    });

    it('hides reply field without calling replyComment when input is empty', () => {
        render(
            <CommentCardReplyField
                commentId={4}
                setShowCommentReplyField={mockSetShowCommentReplyField}
            />
        );

        const replyButton = screen.getAllByRole('button', {name: /reply/i})[0];
        fireEvent.click(replyButton);

        expect(mockReplyComment).not.toHaveBeenCalled();
        expect(mockSetShowCommentReplyField).toHaveBeenCalledWith(false);
    });
});
