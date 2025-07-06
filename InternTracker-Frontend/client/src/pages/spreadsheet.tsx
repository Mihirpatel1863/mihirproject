import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Bell, 
  User, 
  Plus,
  ChevronDown,
  Filter,
  Download,
  Upload,
  Share,
  MoreHorizontal,
  SortAsc,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Copy,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Clock,
  TrendingUp
} from "lucide-react";

interface ProjectData {
  id: number;
  jobRole: string;
  submitDate: string;
  status: string;
  submitter: string;
  url: string;
  assignee: string;
  priority: string;
  dueDate: string;
  estValue: string;
}

// FormulaBar component that was missing
interface FormulaBarProps {
  selectedCell: string | null;
  cellValue: string;
  onApply: (value: string) => void;
}

const FormulaBar = ({ selectedCell, cellValue, onApply }: FormulaBarProps) => {
  const [value, setValue] = useState(cellValue);

  useEffect(() => {
    setValue(cellValue);
  }, [cellValue]);

  const handleApply = () => {
    onApply(value);
  };

  return (
    <div className="bg-gray-100 px-4 py-2 border-b flex items-center">
      <div className="text-sm text-gray-500 mr-2 w-24 truncate">
        {selectedCell || "No cell selected"}
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleApply}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        className="flex-1 bg-white"
      />
    </div>
  );
};

const initialProjectData: ProjectData[] = [
  {
    id: 1,
    jobRole: "Launch social media campaign for pro...",
    submitDate: "15-11-2024",
    status: "In progress",
    submitter: "Alisha Patel",
    url: "www.alishapatel...",
    assignee: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "20-11-2024",
    estValue: "6,200,000"
  },
  // ... rest of your initial data
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Need to start": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Complete": return "bg-green-100 text-green-800 border-green-200";
    case "Blocked": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800 border-red-200";
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function Spreadsheet() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [cellData, setCellData] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<ProjectData[]>(initialProjectData);
  const [sortConfig, setSortConfig] = useState<{key: keyof ProjectData; direction: 'asc' | 'desc'} | null>(null);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card' | 'kanban'>('table');
  const [editingCell, setEditingCell] = useState<{row: number; field: keyof ProjectData} | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [quickActions, setQuickActions] = useState(false);

  // Advanced analytics computed values
  const analytics = useMemo(() => {
    const total = filteredData.length;
    const completed = filteredData.filter(p => p.status === 'Complete').length;
    const inProgress = filteredData.filter(p => p.status === 'In progress').length;
    const blocked = filteredData.filter(p => p.status === 'Blocked').length;
    const highPriority = filteredData.filter(p => p.priority === 'High').length;
    const totalValue = filteredData.reduce((sum, p) => sum + parseInt(p.estValue.replace(/,/g, '') || 0, 0);
    
    return { 
      total, 
      completed, 
      inProgress, 
      blocked, 
      highPriority, 
      totalValue, 
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0 
    };
  }, [filteredData]);

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = initialProjectData.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleSort = (key: keyof ProjectData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredData(sorted);
  };

  const handleFilter = (status?: string) => {
    if (!status) {
      setFilteredData(initialProjectData);
      return;
    }
    
    const filtered = initialProjectData.filter(item => item.status === status);
    setFilteredData(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      Object.keys(initialProjectData[0]).join(','),
      ...filteredData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project_data.csv';
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert('Import functionality: File selected - ' + file.name);
      }
    };
    input.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Project Management Spreadsheet',
        text: 'Check out this project management data',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleNewAction = () => {
    const newProject: ProjectData = {
      id: initialProjectData.length + 1,
      jobRole: "New project task...",
      submitDate: new Date().toLocaleDateString('en-GB'),
      status: "Need to start",
      submitter: "Current User",
      url: "www.newproject...",
      assignee: "Unassigned",
      priority: "Medium",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
      estValue: "0"
    };
    
    setFilteredData(prev => [...prev, newProject]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'f':
          e.preventDefault();
          const searchInput = document.querySelector('input[placeholder="Search within sheet"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        case 'n':
          e.preventDefault();
          handleNewAction();
          break;
        case 'e':
          e.preventDefault();
          handleExport();
          break;
        case 's':
          e.preventDefault();
          handleShare();
          break;
        case 'Enter':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setSelectedRow(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedRow(prev => Math.min(filteredData.length - 1, prev + 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredData[selectedRow]) {
          const project = filteredData[selectedRow];
          alert(`Project Details:\n\n${project.jobRole}\n\nStatus: ${project.status}\nPriority: ${project.priority}\nAssignee: ${project.assignee}\nDue: ${project.dueDate}`);
        }
        break;
      case 'Tab':
        e.preventDefault();
        const tabs = ["All Orders", "Pending", "Reviewed", "Arrived"];
        const currentTabIndex = tabs.indexOf(activeTab);
        const nextTabIndex = (currentTabIndex + 1) % tabs.length;
        setActiveTab(tabs[nextTabIndex]);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        if (selectedRows.length > 0) {
          alert(`Delete ${selectedRows.length} selected row(s)?`);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setQuickActions(false);
        setSelectedRows([]);
        break;
      case ' ':
        e.preventDefault();
        if (filteredData[selectedRow]) {
          const id = filteredData[selectedRow].id;
          handleRowSelect(id);
        }
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown as EventListener);
    return () => document.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [selectedRow, activeTab, filteredData]);

  useEffect(() => {
    let filtered = initialProjectData;
    
    switch (activeTab) {
      case 'Pending':
        filtered = initialProjectData.filter(item => item.status === 'Need to start');
        break;
      case 'Reviewed':
        filtered = initialProjectData.filter(item => item.status === 'In progress');
        break;
      case 'Arrived':
        filtered = initialProjectData.filter(item => item.status === 'Complete');
        break;
      default:
        filtered = initialProjectData;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [activeTab, searchTerm]);

  const tabs = ["All Orders", "Pending", "Reviewed", "Arrived"];

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Rest of your JSX remains the same */}
      {/* ... */}
    </div>
  );
}
