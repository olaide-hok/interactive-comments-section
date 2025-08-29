import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import data from '@/data.json';

export interface Replies {
    id: number;
    content: string;
    createdAt: Date;
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
    createdAt: Date;
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

interface VoteRecord {
    [key: string]: {[username: string]: 1 | -1 | 0};
}

interface CommentStoreState {
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
    votes: VoteRecord;
    incCommentScore: (commentId: number) => void;
    decCommentScore: (commentId: number) => void;
    incReplyScore: (commentId: number, replyId: number) => void;
    decReplyScore: (commentId: number, replyId: number) => void;
}

const dateStorage = createJSONStorage(() => localStorage, {
    // serialize state → string
    replacer: (_key, value) => {
        if (value instanceof Date) {
            return {__type: 'Date', value: value.toISOString()};
        }
        return value;
    },
    // parse string → state (revive dates)
    reviver: (_key, value) => {
        if (typeof value === 'object' && value !== null) {
            if ('__type' in value && value.__type === 'Date') {
                return new Date(
                    (value as {__type: string; value: string}).value
                );
            }
        }
        return value;
    },
});

export const useCommentsStore = create<CommentStoreState>()(
    persist(
        (set, get) => ({
            user: data.currentUser,
            comments: data.comments.map((comment) => ({
                ...comment,
                createdAt: new Date(comment.createdAt),
                replies: comment.replies.map((reply) => ({
                    ...reply,
                    createdAt: new Date(reply.createdAt),
                })),
            })),
            votes: {} as VoteRecord, // keep track of votes

            createComment: (commentText) => {
                const {comments, user} = get();
                const newComment = {
                    id: comments.length + 1,
                    content: commentText,
                    createdAt: new Date(),
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
                const comment = comments.find(
                    (comment) => comment.id === commentId
                );
                if (comment) {
                    const newReply = {
                        id: Date.now(),
                        content: commentText,
                        createdAt: new Date(),
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
                const comment = comments.find(
                    (comment) => comment.id === commentId
                );
                if (comment) {
                    const reply = comment.replies.find(
                        (reply) => reply.id === replyId
                    );
                    if (reply) {
                        const newReply = {
                            id: Date.now(),
                            content: replyText,
                            createdAt: new Date(),
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
                const comment = comments.find(
                    (comment) => comment.id === commentId
                );
                if (comment) {
                    const reply = comment.replies.find(
                        (reply) => reply.id === replyId
                    );
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
                const comment = comments.find(
                    (comment) => comment.id === commentId
                );
                if (comment) {
                    const reply = comment.replies.find(
                        (reply) => reply.id === replyId
                    );
                    if (reply) {
                        set((state) => ({
                            ...state,
                            comments: state.comments.map((c) => {
                                if (c.id === commentId) {
                                    return {
                                        ...c,
                                        replies: c.replies.map((r) =>
                                            r.id === replyId
                                                ? {
                                                      ...r,
                                                      content: replyText,
                                                      createdAt: new Date(),
                                                  }
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

            // increase comment score by one
            incCommentScore: (commentId: number) => {
                const {user, votes} = get();
                const username = user.username;

                const currentVote = votes[commentId]?.[username] ?? 0;
                let newVote: 1 | 0 = 1;
                let scoreDelta = 0;

                if (currentVote === 1) {
                    // already upvoted → remove vote
                    newVote = 0;
                    scoreDelta = -1;
                } else if (currentVote === 0) {
                    // no vote → add upvote
                    newVote = 1;
                    scoreDelta = 1;
                } else if (currentVote === -1) {
                    // was downvoted → neutralize first
                    newVote = 0;
                    scoreDelta = 1;
                }

                set((state) => ({
                    comments: state.comments.map((c) =>
                        c.id === commentId
                            ? {...c, score: c.score + scoreDelta}
                            : c
                    ),
                    votes: {
                        ...state.votes,
                        [commentId]: {
                            ...state.votes[commentId],
                            [username]: newVote,
                        },
                    },
                }));
            },

            // decrease comment score by one
            decCommentScore: (commentId: number) => {
                const {user, votes} = get();
                const username = user.username;

                const currentVote = votes[commentId]?.[username] ?? 0;
                let newVote: -1 | 0 = -1;
                let scoreDelta = 0;

                if (currentVote === -1) {
                    // already downvoted → remove vote
                    newVote = 0;
                    scoreDelta = 1;
                } else if (currentVote === 0) {
                    // no vote → add downvote
                    newVote = -1;
                    scoreDelta = -1;
                } else if (currentVote === 1) {
                    // was upvoted → neutralize first
                    newVote = 0;
                    scoreDelta = -1;
                }

                set((state) => ({
                    comments: state.comments.map((c) =>
                        c.id === commentId
                            ? {...c, score: c.score + scoreDelta}
                            : c
                    ),
                    votes: {
                        ...state.votes,
                        [commentId]: {
                            ...state.votes[commentId],
                            [username]: newVote,
                        },
                    },
                }));
            },

            // increase reply score by one
            incReplyScore: (commentId: number, replyId: number) => {
                const {user, votes} = get();
                const username = user.username;

                const currentVote = votes[replyId]?.[username] ?? 0;
                let newVote: 1 | 0 = 1;
                let scoreDelta = 0;

                if (currentVote === 1) {
                    newVote = 0;
                    scoreDelta = -1;
                } else if (currentVote === 0) {
                    newVote = 1;
                    scoreDelta = 1;
                } else if (currentVote === -1) {
                    newVote = 0;
                    scoreDelta = 1;
                }

                set((state) => ({
                    comments: state.comments.map((c) =>
                        c.id === commentId
                            ? {
                                  ...c,
                                  replies: c.replies.map((r) =>
                                      r.id === replyId
                                          ? {...r, score: r.score + scoreDelta}
                                          : r
                                  ),
                              }
                            : c
                    ),
                    votes: {
                        ...state.votes,
                        [replyId]: {
                            ...state.votes[replyId],
                            [username]: newVote,
                        },
                    },
                }));
            },

            // decrease reply score by one
            decReplyScore: (commentId: number, replyId: number) => {
                const {user, votes} = get();
                const username = user.username;

                const currentVote = votes[replyId]?.[username] ?? 0;
                let newVote: -1 | 0 = -1;
                let scoreDelta = 0;

                if (currentVote === -1) {
                    newVote = 0;
                    scoreDelta = 1;
                } else if (currentVote === 0) {
                    newVote = -1;
                    scoreDelta = -1;
                } else if (currentVote === 1) {
                    newVote = 0;
                    scoreDelta = -1;
                }

                set((state) => ({
                    comments: state.comments.map((c) =>
                        c.id === commentId
                            ? {
                                  ...c,
                                  replies: c.replies.map((r) =>
                                      r.id === replyId
                                          ? {...r, score: r.score + scoreDelta}
                                          : r
                                  ),
                              }
                            : c
                    ),
                    votes: {
                        ...state.votes,
                        [replyId]: {
                            ...state.votes[replyId],
                            [username]: newVote,
                        },
                    },
                }));
            },
        }),

        {
            name: 'comments-storage',
            // storage: createJSONStorage(() => localStorage),
            storage: dateStorage,
        }
    )
);
