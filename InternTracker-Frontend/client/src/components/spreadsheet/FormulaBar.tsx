import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Expand } from "lucide-react";

interface FormulaBarProps {
  selectedCell: string | null;
  cellValue: string;
  onApply: (value: string) => void;
}

export default function FormulaBar({ selectedCell, cellValue, onApply }: FormulaBarProps) {
  const [formulaValue, setFormulaValue] = useState(cellValue);

  useEffect(() => {
    setFormulaValue(cellValue);
  }, [cellValue]);

  const handleApply = () => {
    onApply(formulaValue);
    console.log('Applied formula:', formulaValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="bg-white border-b border-border px-4 py-2 flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">
          {selectedCell || 'A1'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-6 w-6"
          onClick={() => console.log('Expand formula bar')}
        >
          <Expand className="h-3 w-3 text-gray-600" />
        </Button>
      </div>
      <div className="flex-1">
        <Input
          type="text"
          className="w-full px-3 py-1.5 h-8 text-sm bg-white"
          placeholder="Enter formula or value"
          value={formulaValue}
          onChange={(e) => setFormulaValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        onClick={handleApply}
        className="px-3 py-1.5 h-8 bg-accent text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        Apply
      </Button>
    </div>
  );
}
