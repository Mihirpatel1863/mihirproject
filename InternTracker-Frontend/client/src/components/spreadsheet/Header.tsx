import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share, Edit3, User } from "lucide-react";

interface HeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onShare: () => void;
}

export default function Header({ title, onTitleChange, onShare }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleTitleSubmit = () => {
    onTitleChange(editTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <header className="bg-white border-b border-border px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">G</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Gob Spreadsheet</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              className="text-sm h-6 w-48"
              autoFocus
            />
          ) : (
            <>
              <span className="text-sm text-text">{title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-3 w-3 text-text" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          onClick={onShare}
          className="px-3 py-1.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <Share className="h-3 w-3 mr-1" />
          Share
        </Button>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </header>
  );
}
