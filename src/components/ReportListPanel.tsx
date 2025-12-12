import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Clock, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HazardReport } from "@/data/hazardReports";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportListPanelProps {
  reports: HazardReport[];
  selectedReportId: string;
  onSelectReport: (report: HazardReport) => void;
}

const getLabelColor = (label: string): string => {
  switch (label) {
    case "TBC":
      return "bg-warning/10 text-warning border-warning/20";
    case "PSPP":
      return "bg-info/10 text-info border-info/20";
    case "GR":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getReportAge = (tanggal: string): string => {
  const today = new Date();
  const parts = tanggal.split(" ");
  const day = parseInt(parts[0]);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const month = monthNames.indexOf(parts[1]);
  const year = parseInt(parts[2]);
  
  const reportDate = new Date(year, month, day);
  const diffTime = Math.abs(today.getTime() - reportDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "1 hari lalu";
  return `${diffDays} hari lalu`;
};

const ReportListPanel = ({ reports, selectedReportId, onSelectReport }: ReportListPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [labelFilter, setLabelFilter] = useState<string>("all");
  const [hazardFilter, setHazardFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique hazard types
  const hazardTypes = [...new Set(reports.map(r => r.jenisHazard).filter(Boolean))];

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === "" ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.pelapor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.deskripsiTemuan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLabel = labelFilter === "all" || 
      report.labels?.includes(labelFilter as 'TBC' | 'PSPP' | 'GR');
    
    const matchesHazard = hazardFilter === "all" || report.jenisHazard === hazardFilter;

    return matchesSearch && matchesLabel && matchesHazard;
  }).sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : new Date(a.tanggal).getTime();
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : new Date(b.tanggal).getTime();
    return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
  });

  const hasActiveFilters = labelFilter !== "all" || hazardFilter !== "all" || sortOrder !== "desc";

  const clearFilters = () => {
    setLabelFilter("all");
    setHazardFilter("all");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Search & Filter */}
      <div className="p-3 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari laporan..." 
            className="pl-9 bg-background h-8 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        {/* Quick Label Filters */}
        <div className="flex items-center gap-1">
          <Button 
            variant={labelFilter === "TBC" ? "default" : "outline"} 
            size="sm"
            className={`h-6 text-[10px] px-2 ${labelFilter === "TBC" ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}`}
            onClick={() => { setLabelFilter(labelFilter === "TBC" ? "all" : "TBC"); setCurrentPage(1); }}
          >
            TBC
          </Button>
          <Button 
            variant={labelFilter === "PSPP" ? "default" : "outline"} 
            size="sm"
            className={`h-6 text-[10px] px-2 ${labelFilter === "PSPP" ? "bg-info text-info-foreground hover:bg-info/90" : ""}`}
            onClick={() => { setLabelFilter(labelFilter === "PSPP" ? "all" : "PSPP"); setCurrentPage(1); }}
          >
            PSPP
          </Button>
          <Button 
            variant={labelFilter === "GR" ? "default" : "outline"} 
            size="sm"
            className={`h-6 text-[10px] px-2 ${labelFilter === "GR" ? "bg-success text-success-foreground hover:bg-success/90" : ""}`}
            onClick={() => { setLabelFilter(labelFilter === "GR" ? "all" : "GR"); setCurrentPage(1); }}
          >
            GR
          </Button>
        </div>

        {/* Additional Filters */}
        <div className="flex items-center gap-1">
          <Select value={hazardFilter} onValueChange={(v) => { setHazardFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-7 text-[10px] flex-1">
              <SelectValue placeholder="Jenis Hazard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Hazard</SelectItem>
              {hazardTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-7 text-[10px] w-24">
              <SelectValue placeholder="Urutan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Terbaru</SelectItem>
              <SelectItem value="asc">Terlama</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters} 
              className="h-7 w-7 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Report List */}
      <div className="flex-1 overflow-y-auto">
        {paginatedReports.map((report) => {
          const isSelected = report.id === selectedReportId;
          
          return (
            <button
              key={report.id}
              onClick={() => onSelectReport(report)}
              className={`w-full text-left p-3 border-b border-border transition-colors hover:bg-muted/50 ${
                isSelected ? "bg-primary/5 border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded bg-muted flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1 flex-wrap">
                    {report.labels?.map(label => (
                      <span 
                        key={label}
                        className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${getLabelColor(label)}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-xs font-medium text-foreground truncate">
                    {report.id}
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {report.subJenisHazard}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{report.tanggal}</span>
                    <span className="text-muted-foreground/60">•</span>
                    <span>{getReportAge(report.tanggal)}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="p-2 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span>{filteredReports.length} laporan</span>
          <span>Hal {currentPage} / {totalPages || 1}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="w-6 h-6"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 3) {
              pageNum = i + 1;
            } else if (currentPage <= 2) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 1) {
              pageNum = totalPages - 2 + i;
            } else {
              pageNum = currentPage - 1 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="icon"
                className="w-6 h-6 text-[10px]"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="icon"
            className="w-6 h-6"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportListPanel;