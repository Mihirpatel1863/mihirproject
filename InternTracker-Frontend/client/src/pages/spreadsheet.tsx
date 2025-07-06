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

const projectData: ProjectData[] = [
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
  {
    id: 2,
    jobRole: "Update press kit for company redesign",
    submitDate: "28-10-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "www.irfankhan...",
    assignee: "Tejas Pandey",
    priority: "High",
    dueDate: "30-10-2024",
    estValue: "3,500,000"
  },
  {
    id: 3,
    jobRole: "Finalize user testing feedback for app...",
    submitDate: "05-12-2024",
    status: "In progress",
    submitter: "Mark Johnson",
    url: "www.markjohns...",
    assignee: "Rachel Lee",
    priority: "Medium",
    dueDate: "10-12-2024",
    estValue: "4,750,000"
  },
  {
    id: 4,
    jobRole: "Design new features for the website",
    submitDate: "10-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    url: "www.emilygreen...",
    assignee: "Tom Wright",
    priority: "Low",
    dueDate: "15-01-2025",
    estValue: "5,900,000"
  },
  {
    id: 5,
    jobRole: "Prepare financial report for Q4",
    submitDate: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "www.jessicabro...",
    assignee: "Kevin Smith",
    priority: "Low",
    dueDate: "30-01-2025",
    estValue: "2,800,000"
  }
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
  const [filteredData, setFilteredData] = useState(projectData);
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
    const totalValue = filteredData.reduce((sum, p) => sum + parseInt(p.estValue.replace(/,/g, '')), 0);
    
    return { total, completed, inProgress, blocked, highPriority, totalValue, completionRate: Math.round((completed / total) * 100) };
  }, [filteredData]);

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
    console.log('Selected rows:', selectedRows);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = projectData.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
    console.log('Search results:', filtered.length, 'items found for:', term);
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
    console.log('Sorted by:', key, direction);
  };

  const handleFilter = (status?: string) => {
    if (!status) {
      setFilteredData(projectData);
      console.log('Filter cleared');
      return;
    }
    
    const filtered = projectData.filter(item => item.status === status);
    setFilteredData(filtered);
    console.log('Filtered by status:', status, '- Found:', filtered.length, 'items');
  };

  const handleExport = () => {
    const csvContent = [
      Object.keys(projectData[0]).join(','),
      ...filteredData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project_data.csv';
    a.click();
    console.log('Data exported as CSV');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('File selected for import:', file.name);
        alert('Import functionality: File selected - ' + file.name);
      }
    };
    input.click();
  };

  const handleShare = () => {
    const shareData = {
      title: 'Project Management Spreadsheet',
      text: 'Check out this project management data',
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
      console.log('Shared via Web Share API');
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
      console.log('Link copied to clipboard');
    }
  };

  const handleNewAction = () => {
    const newProject: ProjectData = {
      id: projectData.length + 1,
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
    
    projectData.push(newProject);
    setFilteredData([...projectData]);
    console.log('New project added:', newProject);
    alert('New project created! You can now edit the details.');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Global keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'f':
          e.preventDefault();
          document.querySelector('input[placeholder="Search within sheet"]')?.focus();
          console.log('🔍 Focus search (Ctrl+F)');
          break;
        case 'n':
          e.preventDefault();
          handleNewAction();
          console.log('➕ New action (Ctrl+N)');
          break;
        case 'e':
          e.preventDefault();
          handleExport();
          console.log('📤 Export data (Ctrl+E)');
          break;
        case 's':
          e.preventDefault();
          handleShare();
          console.log('🔗 Share (Ctrl+S)');
          break;
        case 'Enter':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          console.log('🖥️ Toggle fullscreen (Ctrl+Enter)');
          break;
      }
      return;
    }

    // Navigation shortcuts
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setSelectedRow(prev => Math.max(0, prev - 1));
        console.log('⬆️ Navigate up to row', Math.max(0, selectedRow));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedRow(prev => Math.min(filteredData.length - 1, prev + 1));
        console.log('⬇️ Navigate down to row', Math.min(filteredData.length, selectedRow + 2));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredData[selectedRow]) {
          console.log('🔍 Opening project:', filteredData[selectedRow].jobRole);
          const project = filteredData[selectedRow];
          alert(`📋 Project Details:\n\n${project.jobRole}\n\nStatus: ${project.status}\nPriority: ${project.priority}\nAssignee: ${project.assignee}\nDue: ${project.dueDate}`);
        }
        break;
      case 'Tab':
        e.preventDefault();
        const currentTabIndex = tabs.indexOf(activeTab);
        const nextTabIndex = (currentTabIndex + 1) % tabs.length;
        setActiveTab(tabs[nextTabIndex]);
        console.log('📑 Tab switch to:', tabs[nextTabIndex]);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        if (selectedRows.length > 0) {
          console.log('🗑️ Delete selected rows:', selectedRows);
          alert(`Delete ${selectedRows.length} selected row(s)?`);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setQuickActions(false);
        setSelectedRows([]);
        console.log('❌ Clear selection and close menus');
        break;
      case ' ':
        e.preventDefault();
        if (filteredData[selectedRow]) {
          const id = filteredData[selectedRow].id;
          handleRowSelect(id);
          console.log('☑️ Toggle row selection');
        }
        break;
    }
  };

  // Keyboard navigation effect
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedRow, activeTab, filteredData]);

  // Filter data based on active tab
  useEffect(() => {
    let filtered = projectData;
    
    switch (activeTab) {
      case 'Pending':
        filtered = projectData.filter(item => item.status === 'Need to start');
        break;
      case 'Reviewed':
        filtered = projectData.filter(item => item.status === 'In progress');
        break;
      case 'Arrived':
        filtered = projectData.filter(item => item.status === 'Complete');
        break;
      default:
        filtered = projectData;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredData(filtered);
  }, [activeTab, searchTerm]);

  const tabs = ["All Orders", "Pending", "Reviewed", "Arrived"];

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Enhanced Header with Analytics */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 animate-fadeIn">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg"></div>
              <span className="text-sm text-gray-600 hover:text-gray-800 transition-colors">Workspace</span>
              <span className="text-sm text-gray-400">&gt;</span>
              <span className="text-sm text-gray-600 hover:text-gray-800 transition-colors">Folder 2</span>
              <span className="text-sm text-gray-400">&gt;</span>
              <span className="text-sm font-medium text-gray-900">Spreadsheet 3</span>
            </div>
            
            {/* Analytics Summary */}
            <div className="hidden lg:flex items-center space-x-4 ml-8 animate-slideIn">
              <div className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <span className="text-xs font-medium text-green-700">
                  {analytics.completionRate}% Complete
                </span>
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <span className="text-xs font-medium text-blue-700">
                  ${(analytics.totalValue / 1000000).toFixed(1)}M Total Value
                </span>
              </div>
              <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <span className="text-xs font-medium text-orange-700">
                  {analytics.highPriority} High Priority
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Input
                type="text"
                placeholder="Search within sheet"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 pr-3 py-1 h-8 text-sm bg-white/80 backdrop-blur-sm w-64 border-gray-200 
                          focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 
                          transition-all duration-200 hover:bg-white"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 
                              group-focus-within:text-blue-500 transition-colors" />
              {searchTerm && (
                <div className="absolute top-9 left-0 right-0 bg-white rounded-lg shadow-lg border p-2 z-50 animate-slideDown">
                  <div className="text-xs text-gray-600">
                    Found {filteredData.length} results for "{searchTerm}"
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hover:bg-gray-100 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            
            <div className="relative group">
              <Bell className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg border p-4 w-64 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                <div className="text-sm font-medium mb-2">Recent Updates</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• 3 projects completed today</div>
                  <div>• 2 high priority items due tomorrow</div>
                  <div>• Team performance up 12%</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center 
                            shadow-md group-hover:shadow-lg transition-shadow">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">John Doe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Premium Toolbar */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 px-6 py-3 animate-slideDown">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsToolbarOpen(!isToolbarOpen)}
              className="hover-lift hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
            >
              <span className="text-sm font-medium">Tool bar</span>
              <ChevronDown className={`ml-1 h-3 w-3 transform transition-transform duration-200 ${
                isToolbarOpen ? 'rotate-180' : ''
              }`} />
            </Button>
            
            <div className="h-4 w-px bg-gray-300"></div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const fields = ['jobRole', 'status', 'priority', 'submitter', 'assignee'];
                const field = fields[Math.floor(Math.random() * fields.length)];
                setHiddenFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]);
                console.log('Toggled field visibility:', field);
              }}
              className="hover-lift hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
            >
              {hiddenFields.length > 0 ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}
              <span className="text-sm">Hide fields</span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const fields = ['jobRole', 'submitDate', 'status', 'priority', 'dueDate', 'estValue'];
                const field = fields[Math.floor(Math.random() * fields.length)];
                handleSort(field as keyof ProjectData);
              }}
              className="hover-lift hover:bg-green-50 hover:text-green-700 transition-all duration-200"
            >
              <SortAsc className="mr-1 h-3 w-3" />
              <span className="text-sm">Sort</span>
              {sortConfig && (
                <span className="ml-1 text-xs bg-green-100 text-green-700 px-1 rounded">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const statuses = ['', 'In progress', 'Complete', 'Blocked', 'Need to start'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                handleFilter(status || undefined);
              }}
              className="hover-lift hover:bg-orange-50 hover:text-orange-700 transition-all duration-200"
            >
              <Filter className="mr-1 h-3 w-3" />
              <span className="text-sm">Filter</span>
              {filteredData.length !== projectData.length && (
                <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-1 rounded">
                  {filteredData.length}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const views = ['table', 'card', 'kanban'] as const;
                const currentIndex = views.indexOf(viewMode);
                const nextView = views[(currentIndex + 1) % views.length];
                setViewMode(nextView);
                console.log('Switched to:', nextView, 'view');
              }}
              className="hover-lift hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
            >
              <span className="text-sm">Cell view</span>
              <ChevronDown className="ml-1 h-3 w-3" />
              <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-1 rounded capitalize">
                {viewMode}
              </span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleImport}
              className="hover-lift hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 hover-glow"
            >
              <Upload className="mr-1 h-3 w-3" />
              <span className="text-sm">Import</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleExport}
              className="hover-lift hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 hover-glow"
            >
              <Download className="mr-1 h-3 w-3" />
              <span className="text-sm">Export</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="hover-lift hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 hover-glow"
            >
              <Share className="mr-1 h-3 w-3" />
              <span className="text-sm">Share</span>
            </Button>
            
            <Button 
              onClick={handleNewAction}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                        text-white text-sm px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 
                        transform hover:scale-105 hover-glow animate-scaleIn"
            >
              <Plus className="mr-1 h-3 w-3" />
              New Action
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuickActions(!quickActions)}
              className="hover-lift hover:bg-gray-50 transition-all duration-200"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Quick Actions Dropdown */}
        {quickActions && (
          <div className="absolute right-6 top-16 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 
                        animate-slideDown min-w-64">
            <div className="text-sm font-medium text-gray-900 mb-3">Quick Actions</div>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <Copy className="mr-2 h-3 w-3" />
                Duplicate Selected Rows
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <Edit className="mr-2 h-3 w-3" />
                Batch Edit Status
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <Calendar className="mr-2 h-3 w-3" />
                Set Due Dates
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <TrendingUp className="mr-2 h-3 w-3" />
                Generate Report
              </Button>
              <div className="border-t pt-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-left text-red-600 hover:bg-red-50">
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Tabs */}
      <div className="bg-white px-6 py-2 flex items-center space-x-6 border-b">
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
          Q3 Financial Overview
        </div>
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-medium">
          Answer a question
        </div>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-medium">
          Extract
        </div>
        <Button variant="ghost" size="sm" className="p-1">
          <Plus className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Main Content */}
      <FormulaBar
  selectedCell={selectedCell}
  cellValue={selectedCell ? cellData[selectedCell] || "" : ""}
  onApply={(value) => {
    if (selectedCell) {
      setCellData((prev) => ({ ...prev, [selectedCell]: value }));
    }
  }}
/>
<div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          {viewMode === 'table' && (
<table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="w-4 p-2"></th>
                {!hiddenFields.includes('jobRole') && (
<th className="text-left p-3 text-sm font-medium text-gray-700 border-r hover:bg-gray-100 cursor-pointer" 
                    onClick={() => handleSort('jobRole')}>
)}
                  Job Role {sortConfig?.key === 'jobRole' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 border-r hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSort('submitDate')}>
                  Submitted {sortConfig?.key === 'submitDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 border-r hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSort('status')}>
                  Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 border-r hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSort('submitter')}>
                  Submitter {sortConfig?.key === 'submitter' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 border-r">URL</th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 border-r hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSort('assignee')}>
                  Assignee {sortConfig?.key === 'assignee' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 border-r hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSort('priority')}>
                  Priority {sortConfig?.key === 'priority' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 border-r hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSort('dueDate')}>
                  Due Date {sortConfig?.key === 'dueDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSort('estValue')}>
                  Est. Value {sortConfig?.key === 'estValue' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((project, index) => (
                <tr key={project.id} 
                    className={`border-b hover:bg-gray-50 group cursor-pointer ${
                      selectedRow === index ? 'bg-blue-50 ring-2 ring-blue-300' : ''
                    }`}
                    onClick={() => {
                      setSelectedRow(index);
                      console.log('Selected project:', project.jobRole);
                    }}>
                  <td className="p-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{project.id}</span>
                    </div>
                  </td>
                  {!hiddenFields.includes('jobRole') && (
<td className="p-3 border-r" onClick={() => setSelectedCell(`jobRole${index}`)}>
                    <div className="text-sm text-gray-900">{cellData[`jobRole${index}`] || project.jobRole}</div>
                  </td>
)}
                  <td className="p-3 border-r">
                    <div className="text-sm text-gray-700">{project.submitDate}</div>
                  </td>
                  <td className="p-3 border-r">
                    <Badge className={`text-xs font-medium cursor-pointer ${getStatusColor(project.status)}`}
                           onClick={(e) => {
                             e.stopPropagation();
                             const newStatus = prompt('Change status to (In progress, Complete, Blocked, Need to start):', project.status);
                             if (newStatus) {
                               project.status = newStatus;
                               setFilteredData([...filteredData]);
                               console.log('Status changed to:', newStatus);
                             }
                           }}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="p-3 border-r">
                    <div className="text-sm text-gray-700">{project.submitter}</div>
                  </td>
                  <td className="p-3 border-r">
                    <div className="text-sm text-blue-600 hover:underline cursor-pointer"
                         onClick={(e) => {
                           e.stopPropagation();
                           window.open('https://' + project.url, '_blank');
                           console.log('Opened URL:', project.url);
                         }}>
                      {project.url}
                    </div>
                  </td>
                  <td className="p-3 border-r">
                    <div className="text-sm text-gray-700">{project.assignee}</div>
                  </td>
                  <td className="p-3 border-r">
                    <Badge className={`text-xs font-medium cursor-pointer ${getPriorityColor(project.priority)}`}
                           onClick={(e) => {
                             e.stopPropagation();
                             const newPriority = prompt('Change priority to (High, Medium, Low):', project.priority);
                             if (newPriority) {
                               project.priority = newPriority;
                               setFilteredData([...filteredData]);
                               console.log('Priority changed to:', newPriority);
                             }
                           }}>
                      {project.priority}
                    </Badge>
                  </td>
                  <td className="p-3 border-r">
                    <div className="text-sm text-gray-700">{project.dueDate}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-gray-700">{project.estValue}</div>
                  </td>
                </tr>
              ))}
              
              {/* Empty rows */}
              {Array.from({ length: 15 }, (_, i) => (
                <tr key={`empty-${i}`} className="border-b hover:bg-gray-50 h-12">
                  <td className="p-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <span className="text-xs text-gray-400">{projectData.length + i + 1}</span>
                    </div>
                  </td>
                  {Array.from({ length: 9 }, (_, j) => (
                    <td key={j} className="p-3 border-r">
                      {j === 8 ? null : <div className="h-4"></div>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
)}
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="bg-white border-t px-6 py-2 flex items-center space-x-6">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            size="sm"
            className={`text-sm ${
              activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => {
              setActiveTab(tab);
              console.log('Switched to tab:', tab);
            }}
          >
            {tab}
          </Button>
        ))}
        <Button variant="ghost" size="sm" className="p-1">
          <Plus className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
