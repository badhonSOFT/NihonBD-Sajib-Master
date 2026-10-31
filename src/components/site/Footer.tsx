import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "./Brand";

export const WHATSAPP_NUMBER = "8801700000000";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.04.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.6 23.6l6-1.57a11.3 11.3 0 0 0 5.43 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03" />
    </svg>
  );
}

export function WhatsAppButton() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/exam")) return null;
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("আসসালামু আলাইকুম, NihonBD সম্পর্কে জানতে চাই।")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp support"
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-float transition-transform hover:scale-105"
    >
      <WhatsAppIcon />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm font-bn text-sm leading-relaxed text-muted-foreground">
            বাংলাদেশি শিক্ষার্থীদের জন্য JLPT N5, N4 ও NAT-TEST এর কম্পিউটার-ভিত্তিক মক টেস্ট — সম্পূর্ণ বাংলা ব্যাখ্যা সহ।
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Platform</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/mock-tests" className="hover:text-foreground">Mock Tests</Link></li>
            <li><Link to="/books" className="hover:text-foreground">Study Books</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Support</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp</a></li>
            <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © NihonBD · JLPT is a registered exam of the Japan Foundation & JEES. NAT-TEST is operated by Senmon Kyouiku Publishing.
      </div>
    </footer>
  );
}
