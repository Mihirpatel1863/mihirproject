import { useEffect, useRef, useState } from "react";
import type { CellData } from "@/types/spreadsheet";

interface SpreadsheetGridProps {
  selectedCell: string | null;
  cellData: CellData;
  onCellSelect: (cellId: string) => void;
  onCellUpdate: (cellId: string, value: string) => void;
}

export default function SpreadsheetGrid({ 
  selectedCell, 
  cellData, 
  onCellSelect, 
  onCellUpdate 
}: SpreadsheetGridProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Generate column headers A-Z
  const columns = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  // Generate row numbers 1-50
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);

  const getCellId = (col: string, row: number) => `${col}${row}`;

  const handleCellClick = (cellId: string) => {
    if (editingCell) {
      finishEditing();
    }
    onCellSelect(cellId);
    console.log('Selected cell:', cellId);
  };

  const handleCellDoubleClick = (cellId: string) => {
    startEditing(cellId);
  };

  const startEditing = (cellId: string) => {
    setEditingCell(cellId);
    setEditValue(cellData[cellId] || '');
    setTimeout(() => editInputRef.current?.focus(), 0);
    console.log('Started editing cell:', cellId);
  };

  const finishEditing = () => {
    if (editingCell) {
      onCellUpdate(editingCell, editValue);
      setEditingCell(null);
      setEditValue('');
      console.log('Finished editing cell:', editingCell);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editingCell) {
      if (e.key === 'Enter') {
        e.preventDefault();
        finishEditing();
      } else if (e.key === 'Escape') {
        setEditingCell(null);
        setEditValue('');
        console.log('Cancelled editing');
      }
      return;
    }

    if (!selectedCell) return;

    const match = selectedCell.match(/([A-Z])(\d+)/);
    if (!match) return;

    const [, currentCol, currentRowStr] = match;
    const currentRow = parseInt(currentRowStr);
    let newCell: string | null = null;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (currentRow > 1) {
          newCell = getCellId(currentCol, currentRow - 1);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (currentRow < 50) {
          newCell = getCellId(currentCol, currentRow + 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const prevColIndex = currentCol.charCodeAt(0) - 65 - 1;
        if (prevColIndex >= 0) {
          newCell = getCellId(String.fromCharCode(65 + prevColIndex), currentRow);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextColIndex = currentCol.charCodeAt(0) - 65 + 1;
        if (nextColIndex < 26) {
          newCell = getCellId(String.fromCharCode(65 + nextColIndex), currentRow);
        }
        break;
      case 'Enter':
        e.preventDefault();
        startEditing(selectedCell);
        break;
    }

    if (newCell) {
      onCellSelect(newCell);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e as any);
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedCell, editingCell]);

  const handleColumnClick = (col: string) => {
    console.log('Selected column:', col);
  };

  const handleRowClick = (row: number) => {
    console.log('Selected row:', row);
  };

  return (
    <div className="flex-1 overflow-hidden bg-white">
      <div className="h-full relative">
        <div className="absolute inset-0 overflow-auto">
          <table className="border-collapse">
            {/* Column Headers */}
            <thead>
              <tr>
                <th className="w-12 h-8 bg-secondary border border-border text-xs font-medium text-gray-600 sticky top-0 left-0 z-20"></th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="min-w-20 h-8 bg-secondary border-r border-border text-xs font-medium text-gray-600 sticky top-0 z-10 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleColumnClick(col)}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Grid Rows */}
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <td
                    className="w-12 h-8 bg-secondary border border-border text-xs font-medium text-gray-600 text-center sticky left-0 z-10 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleRowClick(row)}
                  >
                    {row}
                  </td>
                  {columns.map((col) => {
                    const cellId = getCellId(col, row);
                    const isSelected = selectedCell === cellId;
                    const isEditing = editingCell === cellId;
                    const cellValue = cellData[cellId] || '';

                    return (
                      <td
                        key={cellId}
                        className={`min-w-20 h-8 border-r border-b border-border text-xs p-1 hover:bg-blue-50 cursor-cell focus:outline-none ${
                          isSelected 
                            ? 'bg-blue-100 ring-2 ring-accent' 
                            : ''
                        }`}
                        onClick={() => handleCellClick(cellId)}
                        onDoubleClick={() => handleCellDoubleClick(cellId)}
                      >
                        {isEditing ? (
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={finishEditing}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                finishEditing();
                              } else if (e.key === 'Escape') {
                                setEditingCell(null);
                                setEditValue('');
                              }
                            }}
                            className="w-full h-full border-none outline-none bg-transparent p-0 text-xs"
                          />
                        ) : (
                          <span>{cellValue}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
