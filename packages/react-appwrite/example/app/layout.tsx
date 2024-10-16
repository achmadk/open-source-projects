"use client";
import "./styles.css";
import { Client } from "appwrite";
import type { ReactNode } from "react";
import { AppwriteProvider } from "react-appwrite";

const appwrite = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

type Props = {
  children: ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <html
      lang="en"
      style={{
        background: "black",
      }}
    >
      <head />

      <body>
        <main>
          <AppwriteProvider devTools client={appwrite}>
            {children}
          </AppwriteProvider>
        </main>
      </body>
    </html>
  );
}

export default MainLayout;
