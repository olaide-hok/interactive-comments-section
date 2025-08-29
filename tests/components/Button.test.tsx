import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, it, expect, vi} from 'vitest';
import Button from '@/components/Button';
import {SVGProps} from 'react';

type IconProps = SVGProps<SVGSVGElement>;

// mock Icons to avoid actual SVG complexity
vi.mock('@/components/Icons', () => ({
    Icons: {
        reply: (props: IconProps) => (
            <svg data-testid="reply-icon" {...props} />
        ),
        delete: (props: IconProps) => (
            <svg data-testid="delete-icon" {...props} />
        ),
        edit: (props: IconProps) => <svg data-testid="edit-icon" {...props} />,
    },
}));

describe('Button component', () => {
    it('renders with name text', () => {
        render(<Button name="Click Me" variant="noCancel" />);
        expect(
            screen.getByRole('button', {name: /click me/i})
        ).toBeInTheDocument();
    });

    it('applies correct variant classes', () => {
        render(<Button name="Delete" variant="yesDelete" />);
        const button = screen.getByRole('button', {name: /delete/i});
        expect(button.className).toMatch(/bg-\(--clr-pink-400\)/);
    });

    it('renders reply icon when withIcon=true and variant=replyIcon', () => {
        render(<Button name="Reply" withIcon variant="replyIcon" />);
        expect(screen.getByTestId('reply-icon')).toBeInTheDocument();
    });

    it('renders delete icon when withIcon=true and variant=deleteIcon', () => {
        render(<Button name="Delete" withIcon variant="deleteIcon" />);
        expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });

    it('renders edit icon when withIcon=true and variant=editIcon', () => {
        render(<Button name="Edit" withIcon variant="editIcon" />);
        expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const onClick = vi.fn();
        render(<Button name="Click" variant="reply" onClick={onClick} />);
        const button = screen.getByRole('button', {name: /click/i});

        await userEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies disabled styles when disabled', () => {
        render(
            <Button name="Disabled" variant="replyIcon" withIcon disabled />
        );
        const button = screen.getByRole('button', {name: /disabled/i});
        expect(button.className).toMatch(/cursor-not-allowed/);
    });
});
