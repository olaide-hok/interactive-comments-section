import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, Mock} from 'vitest';
import DeleteCard from '@/components/DeleteCard';
import {useCommentsStore} from '@/store';

// ✅ Mock store hook
vi.mock('@/store', () => ({
    useCommentsStore: vi.fn(),
}));

describe('DeleteCard', () => {
    const mockDeleteReply = vi.fn();
    const mockSetShowDeleteModal = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useCommentsStore as unknown as Mock).mockReturnValue({
            deleteReply: mockDeleteReply,
        });
    });

    it('renders title and message', () => {
        render(
            <DeleteCard
                commentId={1}
                replyId={2}
                setShowDeleteModal={mockSetShowDeleteModal}
            />
        );

        expect(screen.getByText('Delete comment')).toBeInTheDocument();

        expect(
            screen.getByText(/Are you sure you want to delete this comment/i)
        ).toBeInTheDocument();
    });

    it("closes modal when clicking 'No, Cancel'", () => {
        render(
            <DeleteCard
                commentId={1}
                replyId={2}
                setShowDeleteModal={mockSetShowDeleteModal}
            />
        );

        fireEvent.click(screen.getByText('No, Cancel'));

        expect(mockSetShowDeleteModal).toHaveBeenCalledWith(false);
        expect(mockDeleteReply).not.toHaveBeenCalled();
    });

    it("calls deleteReply and closes modal when clicking 'Yes, Delete'", () => {
        render(
            <DeleteCard
                commentId={123}
                replyId={456}
                setShowDeleteModal={mockSetShowDeleteModal}
            />
        );

        fireEvent.click(screen.getByText('Yes, Delete'));

        expect(mockDeleteReply).toHaveBeenCalledWith(123, 456);
        expect(mockSetShowDeleteModal).toHaveBeenCalledWith(false);
    });
});
