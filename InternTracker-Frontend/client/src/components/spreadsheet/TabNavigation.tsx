import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import type { Sheet } from "@/types/spreadsheet";

interface TabNavigationProps {
  sheets: Sheet[];
  activeSheet: string;
  onSheetSwitch: (sheetId: string) => void;
  onAddSheet: () => void;
}

export default function TabNavigation({ 
  sheets, 
  activeSheet, 
  onSheetSwitch, 
  onAddSheet 
}: TabNavigationProps) {
  return (
    <div className="bg-white border-b border-border">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-0">
          {sheets.map((sheet) => (
            <Button
              key={sheet.id}
              variant="ghost"
              className={`px-4 py-2 text-sm font-medium border-b-2 rounded-none ${
                activeSheet === sheet.id
                  ? 'border-accent text-accent bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => onSheetSwitch(sheet.id)}
            >
              {sheet.name}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 ml-2"
            onClick={onAddSheet}
            title="Add Sheet"
          >
            <Plus className="h-3 w-3 text-gray-600" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>100%</span>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6"
            onClick={() => console.log('Zoom out')}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6"
            onClick={() => console.log('Zoom in')}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
