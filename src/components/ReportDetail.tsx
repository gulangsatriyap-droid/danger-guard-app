import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, ZoomIn, Clock, CheckCircle2, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HazardReport, EvaluationStatus } from "@/data/hazardReports";
import AIKnowledgeCard from "./AIKnowledgeCard";

const labelConfig = {
  TBC: { bg: "bg-warning", text: "text-warning-foreground", fullName: "TBC - To be Concern Hazard" },
  PSPP: { bg: "bg-info", text: "text-info-foreground", fullName: "PSPP - Peraturan Sanksi Pelanggaran Prosedur" },
  GR: { bg: "bg-success", text: "text-success-foreground", fullName: "GR - Safety Golden Rules" }
};

const getEvaluationStatusDisplay = (status: EvaluationStatus) => {
  switch (status) {
    case "BELUM_DIEVALUASI":
      return { icon: Clock, label: "Belum Dievaluasi", color: "text-muted-foreground", bg: "bg-muted" };
    case "DALAM_EVALUASI":
      return { icon: AlertCircle, label: "Dalam Evaluasi", color: "text-info", bg: "bg-info/10" };
    case "SELESAI":
      return { icon: CheckCircle2, label: "Selesai", color: "text-success", bg: "bg-success/10" };
    default:
      return { icon: Clock, label: "Unknown", color: "text-muted-foreground", bg: "bg-muted" };
  }
};

interface ReportDetailProps {
  report: HazardReport;
  onBack: () => void;
  currentIndex: number;
  totalReports: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const ReportDetail = ({ report, onBack, currentIndex, totalReports, onNavigate }: ReportDetailProps) => {
  const evalStatus = report.evaluationStatus ? getEvaluationStatusDisplay(report.evaluationStatus) : null;
  const EvalIcon = evalStatus?.icon || Clock;

  return (
    <div className="animate-fade-in p-4 overflow-y-auto h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-primary hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Evaluator Dashboard
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground text-sm">Detail Laporan</span>
      </div>

      {/* Report ID, Labels and Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground">ID: {report.id}</h1>
          {report.labels && report.labels.length > 0 && (
            <div className="flex items-center gap-1">
              {report.labels.map((label) => {
                const config = labelConfig[label];
                return (
                  <span 
                    key={label}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}
          {report.confidenceScore && (
            <Badge variant="outline" className="text-xs">
              {report.confidenceScore}%
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{currentIndex} of {totalReports}</span>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-7 h-7"
              onClick={() => onNavigate('prev')}
              disabled={currentIndex === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-7 h-7"
              onClick={() => onNavigate('next')}
              disabled={currentIndex === totalReports}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column - Status, AI Output, Report Info & Location */}
        <div className="space-y-3">
          {/* Status Evaluasi */}
          <div className="bg-card rounded-lg p-4 card-shadow border-l-4 border-primary">
            <h3 className="font-semibold text-foreground text-sm mb-3">Status Evaluasi</h3>
            {evalStatus && (
              <div className={`flex items-center gap-2 p-2 rounded-lg ${evalStatus.bg}`}>
                <EvalIcon className={`w-4 h-4 ${evalStatus.color}`} />
                <div>
                  <p className={`font-medium text-sm ${evalStatus.color}`}>{evalStatus.label}</p>
                  {report.evaluatorName && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {report.evaluatorName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Output */}
          <div className="bg-card rounded-lg p-4 card-shadow border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">AI Output</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Label Hazard</p>
                <div className="flex flex-wrap gap-1">
                  {report.labels?.map((label) => {
                    const config = labelConfig[label];
                    return (
                      <span 
                        key={label}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${config.bg} ${config.text}`}
                      >
                        {config.fullName}
                      </span>
                    );
                  })}
                </div>
              </div>
              {report.confidenceScore && (
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">Confidence</p>
                  <p className={`text-sm font-bold ${
                    report.confidenceScore >= 90 ? 'text-success' :
                    report.confidenceScore >= 80 ? 'text-warning' : 'text-muted-foreground'
                  }`}>
                    {report.confidenceScore}%
                  </p>
                </div>
              )}
              {report.clusterSuggestion && (
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">Cluster</p>
                  <p className="text-xs font-medium text-primary">{report.clusterSuggestion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pengendalian */}
          <div className="bg-card rounded-lg p-4 card-shadow">
            <h3 className="font-semibold text-foreground text-sm mb-3">Pengendalian</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Pilih konfirmasi</label>
                <Select defaultValue="tutup">
                  <SelectTrigger className="w-full h-8 text-sm">
                    <SelectValue placeholder="Pilih aksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutup">Tutup Laporan</SelectItem>
                    <SelectItem value="proses">Lanjutkan Proses</SelectItem>
                    <SelectItem value="tolak">Tolak Laporan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-sm">
                Selesaikan Evaluasi
              </Button>
            </div>
          </div>

          {/* Informasi Laporan */}
          <div className="bg-card rounded-lg p-4 card-shadow">
            <h3 className="font-semibold text-foreground text-sm mb-3">Informasi Laporan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">ID Laporan</span>
                <span className="font-medium text-xs">{report.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Tanggal</span>
                <span className="font-medium text-xs">{report.tanggalPembuatan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Pelapor</span>
                <span className="font-medium text-xs">{report.pelapor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Role</span>
                <span className="font-medium text-xs">{report.rolePelapor}</span>
              </div>
            </div>
          </div>

          {/* Informasi Lokasi */}
          <div className="bg-card rounded-lg p-4 card-shadow">
            <h3 className="font-semibold text-foreground text-sm mb-3">Informasi Lokasi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Site</span>
                <span className="font-medium text-xs">{report.site}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Lokasi</span>
                <span className="font-medium text-xs">{report.lokasiArea || report.lokasi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Detail</span>
                <span className="font-medium text-xs">{report.detailLokasi}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Deskripsi & Bukti */}
        <div className="space-y-3">
          <div className="bg-card rounded-lg p-4 card-shadow">
            <h3 className="font-semibold text-foreground text-sm mb-3">Deskripsi Objek</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-muted-foreground">Ketidaksesuaian</p>
                <p className="text-xs font-medium text-foreground">{report.ketidaksesuaian || report.jenisHazard}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Sub ketidaksesuaian</p>
                <p className="text-xs font-medium text-foreground">{report.subKetidaksesuaian || report.subJenisHazard}</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-[10px] text-muted-foreground">Quick Action</p>
              <p className="text-xs font-medium text-foreground">{report.quickAction}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <h4 className="font-medium text-foreground text-xs mb-1">Deskripsi Temuan</h4>
              <p className="text-xs text-muted-foreground">{report.deskripsiTemuan}</p>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 card-shadow">
            <h3 className="font-semibold text-foreground text-sm mb-3">Bukti Temuan</h3>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop" 
                alt="Bukti temuan" 
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-2 right-2 w-7 h-7 bg-card/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - AI Knowledge Sources */}
        <div className="space-y-3">
          {report.aiKnowledgeSources && report.aiKnowledgeSources.length > 0 && (
            <>
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Reasoning
              </h3>
              {report.aiKnowledgeSources.map((source, index) => (
                <AIKnowledgeCard key={index} source={source} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;