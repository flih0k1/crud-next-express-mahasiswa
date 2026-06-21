import "./global.css";

export const metadata = {
  title: "Frontend Next.js Express CRUD",
  description: "Dibuat dengan Next.js dan Express.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}