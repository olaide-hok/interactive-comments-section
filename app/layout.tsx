import type {Metadata} from 'next';
import {Rubik} from 'next/font/google';
import './globals.css';

const rubik = Rubik({
    variable: '--font-rubik-sans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'An Interactive Comments Section App',
    description: 'An Interactive Comments Section App built with Next.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${rubik.variable}  antialiased`}>{children}</body>
        </html>
    );
}
