import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ShareBarProps {
  url: string;
  title: string;
}

/** Copy link, plus the device's own share sheet where it exists (most phones). */
export function ShareBar({ url, title }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("We couldn't copy the link. You can copy it from the address bar.");
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // The guest closed the share sheet; nothing to report.
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="secondary" size="sm" onClick={copy}>
        {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy link"}
      </Button>
      {canShare && (
        <Button variant="secondary" size="sm" onClick={share}>
          <Share2 /> Share
        </Button>
      )}
    </div>
  );
}
