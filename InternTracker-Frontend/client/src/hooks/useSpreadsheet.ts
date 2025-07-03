import { useState, useCallback } from "react";
import type { Sheet, CellData } from "@/types/spreadsheet";

const initialSheets: Sheet[] = [
  { id: 'sheet1', name: 'Sheet1' },
  { id: 'sheet2', name: 'Sheet2' },
  { id: 'sheet3', name: 'Sheet3' },
];

const initialCellData: CellData = {
  'A1': 'Revenue',
  'B1': '10000',
  'C1': '12000',
  'D1': '15000',
  'E1': '18000',
  'A2': 'Expenses',
  'B2': '7000',
  'C2': '8500',
  'D2': '9200',
  'E2': '11000',
  'A3': 'Profit',
  'B3': '=B1-B2',
  'C3': '=C1-C2',
  'D3': '=D1-D2',
  'E3': '=E1-E2',
};

export function useSpreadsheet() {
  const [selectedCell, setSelectedCell] = useState<string | null>('A3');
  const [activeSheet, setActiveSheet] = useState('sheet1');
  const [sheets, setSheets] = useState<Sheet[]>(initialSheets);
  const [cellData, setCellData] = useState<CellData>(initialCellData);
  const [documentTitle, setDocumentTitle] = useState('Untitled Spreadsheet');
  const [searchTerm, setSearchTerm] = useState('');

  const selectCell = useCallback((cellId: string) => {
    setSelectedCell(cellId);
  }, []);

  const switchSheet = useCallback((sheetId: string) => {
    setActiveSheet(sheetId);
    console.log('Switched to sheet:', sheetId);
  }, []);

  const addSheet = useCallback(() => {
    const newSheetNumber = sheets.length + 1;
    const newSheet: Sheet = {
      id: `sheet${newSheetNumber}`,
      name: `Sheet${newSheetNumber}`,
    };
    setSheets(prev => [...prev, newSheet]);
    console.log('Added new sheet:', newSheet.name);
  }, [sheets.length]);

  const updateCell = useCallback((cellId: string, value: string) => {
    setCellData(prev => ({
      ...prev,
      [cellId]: value,
    }));
    console.log('Updated cell:', cellId, 'with value:', value);
  }, []);

  const updateDocumentTitle = useCallback((title: string) => {
    setDocumentTitle(title);
    console.log('Document title changed to:', title);
  }, []);

  const handleToolbarAction = useCallback((action: string, value?: any) => {
    console.log('Toolbar action:', action, value ? `with value: ${value}` : '');
    
    switch (action) {
      case 'share':
        alert('Share functionality would be implemented here');
        break;
      case 'undo':
        console.log('Undo action triggered');
        break;
      case 'redo':
        console.log('Redo action triggered');
        break;
      case 'bold':
      case 'italic':
      case 'underline':
        console.log(`${action} formatting applied`);
        break;
      case 'alignLeft':
      case 'alignCenter':
      case 'alignRight':
        console.log(`${action} alignment applied`);
        break;
      case 'fontFamily':
        console.log('Font family changed to:', value);
        break;
      case 'fontSize':
        console.log('Font size changed to:', value);
        break;
      case 'insertChart':
        console.log('Insert chart triggered');
        break;
      case 'insertFunction':
        console.log('Insert function triggered');
        break;
      case 'moreOptions':
        console.log('More options clicked');
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, []);

  return {
    selectedCell,
    activeSheet,
    sheets,
    cellData,
    documentTitle,
    searchTerm,
    selectCell,
    switchSheet,
    addSheet,
    updateCell,
    updateDocumentTitle,
    handleToolbarAction,
    setSearchTerm,
  };
}
