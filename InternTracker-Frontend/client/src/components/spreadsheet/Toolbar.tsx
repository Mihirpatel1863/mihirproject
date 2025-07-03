import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  BarChart3,
  Parentheses,
  MoreHorizontal,
  Search
} from "lucide-react";

interface ToolbarProps {
  onAction: (action: string, value?: any) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function Toolbar({ onAction, searchTerm, onSearchChange }: ToolbarProps) {
  return (
    <div className="bg-secondary border-b border-border px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {/* File Operations */}
          <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('undo')}
              title="Undo"
            >
              <Undo className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('redo')}
              title="Redo"
            >
              <Redo className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
          
          {/* Formatting */}
          <div className="flex items-center space-x-1 pl-3 pr-3 border-r border-gray-300">
            <Select onValueChange={(value) => onAction('fontFamily', value)} defaultValue="Inter">
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times">Times</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => onAction('fontSize', value)} defaultValue="11">
              <SelectTrigger className="w-16 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="11">11</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Text Formatting */}
          <div className="flex items-center space-x-1 pl-3 pr-3 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('bold')}
              title="Bold"
            >
              <Bold className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('italic')}
              title="Italic"
            >
              <Italic className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('underline')}
              title="Underline"
            >
              <Underline className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
          
          {/* Alignment */}
          <div className="flex items-center space-x-1 pl-3 pr-3 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('alignLeft')}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('alignCenter')}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('alignRight')}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
          
          {/* More Tools */}
          <div className="flex items-center space-x-1 pl-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('insertChart')}
              title="Insert Chart"
            >
              <BarChart3 className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('insertFunction')}
              title="Insert Parentheses"
            >
              <Parentheses className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onAction('moreOptions')}
              title="More"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1 h-8 text-sm bg-white w-48"
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
