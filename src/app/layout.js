import "./globals.css";

export const metadata = {
  title: "Monthly Checklist",
  description: "Personal monthly payment checklist",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}