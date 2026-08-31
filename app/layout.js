import "./globals.css";

export const metadata = {
  title: "Seekho 2 Wheeler Training App",
  description: "Two Wheeler Training Attendance & Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
