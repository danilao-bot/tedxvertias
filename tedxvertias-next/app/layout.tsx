import type { Metadata } from "next";
import "./globals.css";
// Fonts are loaded via Google Fonts CDN <link> in <head> below

export const metadata: Metadata = {
  title: "TEDxVeritasUniversity — Neo-Intelligence",
  description: "Shaping an Intelligent Africa Through Innovation and Culture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='0' fill='%23000000'/%3E%3Crect x='0' y='0' width='512' height='6' fill='%23EB0028'/%3E%3Crect x='0' y='506' width='512' height='6' fill='%23EB0028'/%3E%3Crect x='0' y='0' width='6' height='512' fill='%23EB0028'/%3E%3Crect x='506' y='0' width='6' height='512' fill='%23EB0028'/%3E%3Ctext x='256' y='310' font-family='Montserrat,Arial Black,sans-serif' font-size='260' font-weight='900' text-anchor='middle' letter-spacing='-18' fill='%23FFFFFF'%3ET%3C/text%3E%3Ctext x='256' y='310' font-family='Montserrat,Arial Black,sans-serif' font-size='260' font-weight='900' text-anchor='middle' letter-spacing='-18' fill='%23EB0028' opacity='0' %3EV%3C/text%3E%3Ctext x='310' y='310' font-family='Montserrat,Arial Black,sans-serif' font-size='260' font-weight='900' text-anchor='middle' fill='%23EB0028'%3EV%3C/text%3E%3Cline x1='80' y1='340' x2='432' y2='340' stroke='%23EB0028' stroke-width='6'/%3E%3Ctext x='256' y='420' font-family='Montserrat,Arial,sans-serif' font-size='56' font-weight='700' text-anchor='middle' letter-spacing='8' fill='%23EB0028'%3ETEDx%3C/text%3E%3C/svg%3E" />
        <link rel="shortcut icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' fill='%23000000'/%3E%3Crect x='0' y='0' width='512' height='6' fill='%23EB0028'/%3E%3Crect x='0' y='506' width='512' height='6' fill='%23EB0028'/%3E%3Crect x='0' y='0' width='6' height='512' fill='%23EB0028'/%3E%3Crect x='506' y='0' width='6' height='512' fill='%23EB0028'/%3E%3Ctext x='200' y='310' font-family='Arial Black,sans-serif' font-size='260' font-weight='900' text-anchor='middle' fill='%23FFFFFF'%3ET%3C/text%3E%3Ctext x='330' y='310' font-family='Arial Black,sans-serif' font-size='260' font-weight='900' text-anchor='middle' fill='%23EB0028'%3EV%3C/text%3E%3Cline x1='80' y1='340' x2='432' y2='340' stroke='%23EB0028' stroke-width='6'/%3E%3Ctext x='256' y='420' font-family='Arial,sans-serif' font-size='56' font-weight='700' text-anchor='middle' letter-spacing='8' fill='%23EB0028'%3ETEDx%3C/text%3E%3C/svg%3E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,300;1,300&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}