import {create} from 'zustand';
import data from '@/data.json';
import {timeAgo} from './utils';

export interface Replies {
    id: number;
    content: string;
    createdAt: string;
    score: number;
    replyingTo: string;
    user: {
        image: {
            png: string;
            webp: string;
        };
        username: string;
    };
}

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    score: number;
    user: {
        image: {
            png: string;
            webp: string;
        };
        username: string;
    };
    replies: Replies[];
}

interface Comments {
    currentUser: {
        image: {
            png: string;
            webp: string;
        };
        username: string;
    };
    comments: Comment[];
}

interface CommentStoreSate {
    user: Comments['currentUser'];
    comments: Comment[];
    createComment: (commentText: string) => void;
    replyComment: (commentId: number, commentText: string) => void;
    replyReply: (commentId: number, replyId: number, replyText: string) => void;
    deleteReply: (commentId: number, replyId: number) => void;
    updateReply: (
        commentId: number,
        replyId: number,
        replyText: string
    ) => void;
}

export const useCommentsStore = create<CommentStoreSate>((set, get) => ({
    user: data.currentUser,
    comments: data.comments,

    createComment: (commentText) => {
        const {comments, user} = get();
        const newComment = {
            id: comments.length + 1,
            content: commentText,
            createdAt: timeAgo(new Date().toISOString()),
            score: 0,
            user: user,
            replies: [],
        };

        // set state immutably
        set((state) => ({
            ...state,
            comments: [newComment, ...comments],
        }));
    },

    replyComment: (commentId, commentText) => {
        const {comments, user} = get();
        const comment = comments.find((comment) => comment.id === commentId);
        if (comment) {
            const newReply = {
                id: parseInt(Math.random().toFixed(2)),
                content: commentText,
                createdAt: timeAgo(new Date().toISOString()),
                score: 0,
                replyingTo: comment.user.username,
                user: user,
            };
            set((state) => ({
                ...state,
                comments: state.comments.map((c) =>
                    c.id === commentId
                        ? {...c, replies: [...c.replies, newReply]}
                        : c
                ),
            }));
        }
    },

    // reply replies
    replyReply: (commentId, replyId, replyText) => {
        const {comments} = get();
        const comment = comments.find((comment) => comment.id === commentId);
        if (comment) {
            const reply = comment.replies.find((reply) => reply.id === replyId);
            if (reply) {
                const newReply = {
                    id: parseInt(Math.random().toPrecision(2)),
                    content: replyText,
                    createdAt: timeAgo(new Date().toISOString()),
                    score: 0,
                    replyingTo: reply.user.username,
                    user: get().user,
                };

                set((state) => ({
                    ...state,
                    comments: state.comments.map((c) => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                replies: [...c.replies, newReply],
                            };
                        }
                        return c;
                    }),
                }));
            }
        }
    },

    //  delete reply reply
    deleteReply: (commentId, replyId) => {
        const {comments} = get();
        const comment = comments.find((comment) => comment.id === commentId);
        if (comment) {
            const reply = comment.replies.find((reply) => reply.id === replyId);
            if (reply) {
                set((state) => ({
                    ...state,
                    comments: state.comments.map((c) => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                replies: c.replies.filter(
                                    (r) => r.id !== replyId
                                ),
                            };
                        }
                        return c;
                    }),
                }));
            }
        }
    },

    // update reply
    updateReply: (commentId, replyId, replyText) => {
        const {comments} = get();
        const comment = comments.find((comment) => comment.id === commentId);
        if (comment) {
            const reply = comment.replies.find((reply) => reply.id === replyId);
            if (reply) {
                set((state) => ({
                    ...state,
                    comments: state.comments.map((c) => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                replies: c.replies.map((r) =>
                                    r.id === replyId
                                        ? {...r, content: replyText}
                                        : r
                                ),
                            };
                        }
                        return c;
                    }),
                }));
            }
        }
    },
}));
