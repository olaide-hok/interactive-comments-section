import {create} from 'zustand';
import data from '@/data.json';

interface Replies {
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
}

export const useCommentsStore = create<CommentStoreSate>((set, get) => ({
    user: data.currentUser,
    comments: data.comments,
}));
