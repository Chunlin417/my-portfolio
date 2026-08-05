"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "short",
});

export default function Footer() {
  // Rendered only after mount: the server has no notion of "now" in the
  // visitor's request, so committing a time during SSR guarantees a
  // hydration mismatch a second later.
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setNow(formatter.format(new Date()));

    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Chunlin He</span>

      <span className="footer__clock">
        {now && (
          <>
            <span className="footer__pulse" aria-hidden="true" />
            Toronto · {now}
          </>
        )}
      </span>
    </footer>
  );
}
