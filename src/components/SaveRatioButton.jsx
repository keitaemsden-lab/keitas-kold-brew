import React, { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

/**
 * Small save button with confirmation toast.
 * Displays a bookmark icon that changes to a checkmark with "Saved!" text
 * for 1.5 seconds after the save is triggered.
 *
 * @param {{ onSave: () => void, label?: string }} props
 *   - onSave: callback invoked when the save button is clicked
 *   - label: optional tooltip and aria-label (default: "Save ratio")
 */
export default function SaveRatioButton({ onSave, label = 'Save ratio' }) {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 bg-brew-mid rounded-input px-3 py-2 min-h-[48px] transition-all duration-200 hover:bg-brew-border"
      aria-label={label}
      title={label}
      type="button"
    >
      {saved ? (
        <>
          <BookmarkCheck size={18} className="text-brew-success transition-colors duration-200" />
          <span className="text-brew-success text-xs font-body">Saved!</span>
        </>
      ) : (
        <Bookmark size={18} className="text-brew-muted transition-colors duration-200" />
      )}
    </button>
  );
}
