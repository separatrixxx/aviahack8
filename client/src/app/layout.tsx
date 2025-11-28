import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import styles from './layout.module.scss';

import './globals.scss';


const roboto = Roboto({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '700'],
    variable: '--font-roboto',
});

export const metadata: Metadata = {
    title: 'Aviahack8',
    description: 'Aviahack8',
    icons: {
        icon: '/icons/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className={`${roboto.variable}`}>
            <body>
                <main className={styles.layout}>
                    {children}
                </main>
            </body>
        </html>
    );
}
