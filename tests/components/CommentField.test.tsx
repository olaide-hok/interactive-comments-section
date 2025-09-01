import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, Mock} from 'vitest';
import CommentField from '@/components/CommentField';
import {useCommentsStore} from '@/store';

// ✅ Mock the store
vi.mock('@/store', () => ({
    useCommentsStore: vi.fn(),
}));

describe('CommentField', () => {
    const mockCreateComment = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useCommentsStore as unknown as Mock).mockReturnValue({
            createComment: mockCreateComment,
        });
    });

    it('renders textarea and send button', () => {
        render(<CommentField />);

        expect(
            screen.getByPlaceholderText(/add a comment/i)
        ).toBeInTheDocument();
        expect(
            screen.getAllByRole('button', {name: /send/i}).length
        ).toBeGreaterThan(0);
    });

    it('updates textarea value when typing', () => {
        render(<CommentField />);

        const textarea = screen.getByPlaceholderText(
            /add a comment/i
        ) as HTMLTextAreaElement;
        fireEvent.change(textarea, {target: {value: 'Hello world'}});

        expect(textarea.value).toBe('Hello world');
    });

    it('calls createComment and clears textarea on send', () => {
        render(<CommentField />);

        const textarea = screen.getByPlaceholderText(
            /add a comment/i
        ) as HTMLTextAreaElement;
        const sendButton = screen.getAllByRole('button', {name: /send/i})[0];

        fireEvent.change(textarea, {target: {value: 'My first comment'}});
        fireEvent.click(sendButton);

        // ✅ Check store call
        expect(mockCreateComment).toHaveBeenCalledWith('My first comment');

        // ✅ Textarea cleared
        expect(textarea.value).toBe('');
    });

    it('trims whitespace before sending comment', () => {
        render(<CommentField />);

        const textarea = screen.getByPlaceholderText(
            /add a comment/i
        ) as HTMLTextAreaElement;
        const sendButton = screen.getAllByRole('button', {name: /send/i})[0];

        fireEvent.change(textarea, {target: {value: '   padded comment   '}});
        fireEvent.click(sendButton);

        expect(mockCreateComment).toHaveBeenCalledWith('padded comment');
    });
});
