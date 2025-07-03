export interface Sheet {
  id: string;
  name: string;
}

export interface CellData {
  [cellId: string]: string;
}

export interface SpreadsheetState {
  selectedCell: string | null;
  activeSheet: string;
  sheets: Sheet[];
  cellData: CellData;
  documentTitle: string;
  searchTerm: string;
}
