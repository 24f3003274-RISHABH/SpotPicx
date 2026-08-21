import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  variant?: 'outline' | 'ghost' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text,
  url,
  variant = 'outline',
  size = 'sm',
  className = '',
  label = 'Share',
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = url || window.location.href;
    const shareData = {
      title,
      text: text || `Check out ${title} on SpotPicks Delhi NCR!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Clipboard write error', err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={`transition-all ${className}`}
      leftIcon={
        copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-600 animate-in fade-in zoom-in duration-200" />
        ) : (
          <Share2 className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-600" />
        )
      }
    >
      {copied ? 'Link Copied!' : label}
    </Button>
  );
};
