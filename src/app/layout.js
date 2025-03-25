// src/app/layout.js
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
