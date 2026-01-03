import { useState } from "react";
import { X, Users, AlertTriangle, CheckCircle, HelpCircle, ChevronDown, ChevronUp, MapPin, Calendar, User, Image, Layers, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ClusterInfo, hazardReports } from "@/data/hazardReports";

interface ClusterPanelProps {
  cluster: ClusterInfo;
  onClose: () => void;
  onSelectReport: (reportId: string) => void;
}

const getStatusColor = (status: ClusterInfo['status']) => {
  switch (status) {
    case 'Duplikat Kuat':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Duplikat Mungkin':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'Bukan Duplikat':
      return 'bg-success/10 text-success border-success/20';
  }
};

const getStatusIcon = (status: ClusterInfo['status']) => {
  switch (status) {
    case 'Duplikat Kuat':
      return <AlertTriangle className="w-4 h-4" />;
    case 'Duplikat Mungkin':
      return <HelpCircle className="w-4 h-4" />;
    case 'Bukan Duplikat':
      return <CheckCircle className="w-4 h-4" />;
  }
};

const ClusterPanel = ({ cluster, onClose, onSelectReport }: ClusterPanelProps) => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  // Get reports in this cluster
  const clusterReports = hazardReports.filter(r => r.cluster === cluster.id);
  
  const getScoreColor = (score: number) => {
    if (score >= 0.75) return "text-success";
    if (score >= 0.5) return "text-warning";
    return "text-destructive";
  };

  const similarityPercent = Math.round(cluster.similarityScore * 100);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-card w-full max-w-2xl h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">{cluster.id}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getStatusColor(cluster.status)}>
                  {getStatusIcon(cluster.status)}
                  <span className="ml-1">{cluster.status}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {cluster.reportCount} laporan duplikat
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Cluster Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Skor Kemiripan Cluster</span>
              <span className={`text-2xl font-bold ${
                similarityPercent >= 75 ? 'text-destructive' :
                similarityPercent >= 50 ? 'text-warning' : 'text-success'
              }`}>
                {similarityPercent}%
              </span>
            </div>
            <Progress value={similarityPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {cluster.reportCount} laporan terdeteksi sebagai duplikat berdasarkan analisis AI.
            </p>
          </div>

          {/* AI Analysis Accordion */}
          <Accordion type="single" collapsible className="bg-muted/30 rounded-lg">
            <AccordionItem value="analysis" className="border-none">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">Detail Analisis AI</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Geo Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(cluster.components.locationRadius)}`}>
                        {Math.round(cluster.components.locationRadius * 100)}%
                      </span>
                    </div>
                    <Progress value={cluster.components.locationRadius * 100} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">Kedekatan lokasi geografis</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Lexical Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(cluster.components.locationName)}`}>
                        {Math.round(cluster.components.locationName * 100)}%
                      </span>
                    </div>
                    <Progress value={cluster.components.locationName * 100} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">Kesamaan kata/teks</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Semantic Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(cluster.components.findingDescription)}`}>
                        {Math.round(cluster.components.findingDescription * 100)}%
                      </span>
                    </div>
                    <Progress value={cluster.components.findingDescription * 100} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">Kesamaan makna/konteks</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Image Context</span>
                      <span className={`text-sm font-bold ${getScoreColor(cluster.components.imageContext)}`}>
                        {Math.round(cluster.components.imageContext * 100)}%
                      </span>
                    </div>
                    <Progress value={cluster.components.imageContext * 100} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">Kesamaan konteks gambar</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Reports in Cluster */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Laporan Duplikat ({clusterReports.length})</h4>
            <div className="space-y-3">
              {clusterReports.map((report, index) => (
                <div
                  key={report.id}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedReportId === report.id 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-muted/30 border-border/50 hover:border-primary/20'
                  }`}
                >
                  {/* Report Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {report.id}
                      </Badge>
                      {index === 0 && (
                        <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-xs">
                          Laporan Utama
                        </Badge>
                      )}
                    </div>
                    {report.duplicateScores && (
                      <span className={`text-lg font-bold ${
                        report.duplicateScores.overall >= 0.75 ? 'text-destructive' :
                        report.duplicateScores.overall >= 0.5 ? 'text-warning' : 'text-success'
                      }`}>
                        {Math.round(report.duplicateScores.overall * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Report Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{report.pelapor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{report.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{report.site} - {report.lokasi}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <p className="text-sm text-foreground line-clamp-2">
                      {report.deskripsiTemuan}
                    </p>
                  </div>

                  {/* Image Placeholder */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border border-border">
                      <Image className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground border border-border">
                      +2
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  {report.duplicateScores && (
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border/50">
                      <div className="text-center">
                        <span className="text-[10px] text-muted-foreground block">Rule</span>
                        <span className={`text-xs font-bold ${getScoreColor(report.duplicateScores.ruleBased)}`}>
                          {Math.round(report.duplicateScores.ruleBased * 100)}%
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-muted-foreground block">Geo</span>
                        <span className={`text-xs font-bold ${getScoreColor(report.duplicateScores.geo)}`}>
                          {Math.round(report.duplicateScores.geo * 100)}%
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-muted-foreground block">Lexical</span>
                        <span className={`text-xs font-bold ${getScoreColor(report.duplicateScores.lexical)}`}>
                          {Math.round(report.duplicateScores.lexical * 100)}%
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-muted-foreground block">Semantic</span>
                        <span className={`text-xs font-bold ${getScoreColor(report.duplicateScores.semantic)}`}>
                          {Math.round(report.duplicateScores.semantic * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              Bukan Duplikat
            </Button>
            <Button className="bg-primary text-primary-foreground">
              Konfirmasi Duplikat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterPanel;
