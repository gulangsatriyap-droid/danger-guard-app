import { useState } from "react";
import { X, FileText, Calendar, User, MapPin, Building, Image, Star, Sparkles, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClusterInfo, hazardReports, HazardReport } from "@/data/hazardReports";

interface ClusterPanelProps {
  cluster: ClusterInfo;
  onClose: () => void;
  onSelectReport: (reportId: string) => void;
}

const ClusterPanel = ({ cluster, onClose, onSelectReport }: ClusterPanelProps) => {
  const [sortBy, setSortBy] = useState("semantic");
  const [selectedCompareReport, setSelectedCompareReport] = useState<HazardReport | null>(null);
  
  // Get reports in this cluster
  const clusterReports = hazardReports.filter(r => r.cluster === cluster.id);
  
  // First report is the representative
  const representativeReport = clusterReports[0];
  const similarReports = clusterReports.slice(1);

  const getScoreColor = (score: number) => {
    if (score >= 0.75) return "text-destructive";
    if (score >= 0.5) return "text-warning";
    return "text-success";
  };

  const sortedSimilarReports = [...similarReports].sort((a, b) => {
    if (!a.duplicateScores || !b.duplicateScores) return 0;
    switch (sortBy) {
      case "semantic":
        return b.duplicateScores.semantic - a.duplicateScores.semantic;
      case "lexical":
        return b.duplicateScores.lexical - a.duplicateScores.lexical;
      case "geo":
        return b.duplicateScores.geo - a.duplicateScores.geo;
      default:
        return b.duplicateScores.overall - a.duplicateScores.overall;
    }
  });

  const handleReportClick = (report: HazardReport) => {
    setSelectedCompareReport(report);
  };

  const handleBackToList = () => {
    setSelectedCompareReport(null);
  };

  if (!representativeReport) return null;

  // Comparison View
  if (selectedCompareReport) {
    const repScore = representativeReport.duplicateScores;
    const compScore = selectedCompareReport.duplicateScores;
    
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end">
        <div className="bg-card w-full max-w-5xl h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleBackToList}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Semantic Review</h3>
                <p className="text-sm text-muted-foreground">Mode Perbandingan Makna</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Similarity Summary */}
          <div className="px-5 py-3 border-b border-border bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Ringkasan Kemiripan Semantik
            </p>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">
                  A: {Math.round((repScore?.semantic || 0.85) * 100)}% | B: {Math.round((compScore?.semantic || 0.91) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-success text-success-foreground gap-1">
                Keduanya Punya Gambar
              </Badge>
              {representativeReport.site === selectedCompareReport.site && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  Site Sama
                </Badge>
              )}
              {representativeReport.lokasi === selectedCompareReport.lokasi && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  Lokasi Sama
                </Badge>
              )}
            </div>
          </div>

          {/* Two Column Comparison */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column - Report A (Utama) */}
            <ScrollArea className="flex-1 border-r border-border">
              <div className="p-5 space-y-4">
                {/* Report Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">Laporan A (Utama)</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {representativeReport.id}
                  </Badge>
                </div>

                {/* Report Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{representativeReport.tanggal}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{representativeReport.pelapor}</span>
                  </div>
                </div>

                {/* Site and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Site</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{representativeReport.site}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Lokasi</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{representativeReport.lokasi}</span>
                    </div>
                  </div>
                </div>

                {/* Cluster Badge */}
                <div>
                  <span className="text-xs text-muted-foreground">Asal Cluster</span>
                  <div className="mt-1.5 text-sm text-muted-foreground">
                    Tidak ada cluster sebelumnya
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium text-sm">Deskripsi Temuan</span>
                  </div>
                  <p className="text-sm text-foreground">
                    {representativeReport.deskripsiTemuan}
                  </p>
                </div>

                {/* Image Section */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Image className="w-4 h-4" />
                    <span className="font-medium text-sm">Gambar Temuan (1)</span>
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                    <Image className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                </div>

                {/* Semantic Analysis */}
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-foreground" />
                    <span className="font-medium text-sm text-foreground">Analisis Semantik</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Sinyal Visual Terdeteksi</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs bg-background">
                          tumpahan cairan
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-background">
                          area parkir
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-background">
                          lantai licin
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Target className="w-3 h-3" />
                        <span>Interpretasi Makna</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        Gambar menunjukkan tumpahan oli di area parkir yang berpotensi menyebabkan kecelakaan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Right Column - Report B (Pembanding) */}
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-4">
                {/* Report Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">Laporan B (Pembanding)</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedCompareReport.id}
                  </Badge>
                </div>

                {/* Report Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedCompareReport.tanggal}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{selectedCompareReport.pelapor}</span>
                  </div>
                </div>

                {/* Site and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Site</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{selectedCompareReport.site}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Lokasi</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{selectedCompareReport.lokasi}</span>
                    </div>
                  </div>
                </div>

                {/* Cluster Badge */}
                <div>
                  <span className="text-xs text-muted-foreground">Asal Cluster</span>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1">
                      <MapPin className="w-3 h-3" />
                      GCL-0001
                    </Badge>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 gap-1">
                      <FileText className="w-3 h-3" />
                      LCL-0001
                    </Badge>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium text-sm">Deskripsi Temuan</span>
                  </div>
                  <p className="text-sm text-foreground">
                    {selectedCompareReport.deskripsiTemuan}
                  </p>
                </div>

                {/* Image Section */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Image className="w-4 h-4" />
                    <span className="font-medium text-sm">Gambar Temuan (1)</span>
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                    <Image className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                </div>

                {/* Semantic Analysis */}
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-foreground" />
                    <span className="font-medium text-sm text-foreground">Analisis Semantik</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Sinyal Visual Terdeteksi</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs bg-background">
                          objek teridentifikasi
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-background">
                          kondisi terdeteksi
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <Target className="w-3 h-3" />
                        <span>Interpretasi Makna</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        Analisis semantik menunjukkan kemiripan visual dengan laporan utama berdasarkan konteks gambar dan deskripsi temuan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border flex items-center justify-between gap-3">
            <Button variant="outline" onClick={handleBackToList}>
              Kembali ke Daftar
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
  }

  // List View (Default)
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-card w-full max-w-4xl h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Semantic Review</h3>
              <p className="text-sm text-muted-foreground">Analisis Gambar & Deskripsi</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Two Column Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Representative Report */}
          <ScrollArea className="flex-1 border-r border-border">
            <div className="p-5 space-y-4">
              {/* Main Report Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-foreground">Laporan Utama</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {representativeReport.id}
                </Badge>
              </div>

              {/* Report Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{representativeReport.tanggal}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{representativeReport.pelapor}</span>
                </div>
              </div>

              {/* Site and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Site</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{representativeReport.site}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Lokasi</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{representativeReport.lokasi}</span>
                  </div>
                </div>
              </div>

              {/* Cluster Badge */}
              <div>
                <span className="text-xs text-muted-foreground">Asal Cluster</span>
                <div className="mt-1.5 text-sm text-muted-foreground">
                  Tidak ada cluster sebelumnya
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium text-sm">Deskripsi Temuan</span>
                </div>
                <p className="text-sm text-foreground">
                  {representativeReport.deskripsiTemuan}
                </p>
              </div>

              {/* Image Section */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Image className="w-4 h-4" />
                  <span className="font-medium text-sm">Gambar Temuan (1)</span>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                  <Image className="w-12 h-12 text-muted-foreground/30" />
                </div>
              </div>

              {/* Semantic Analysis */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-foreground" />
                  <span className="font-medium text-sm text-foreground">Analisis Semantik</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Sinyal Visual Terdeteksi</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs bg-background">
                        tumpahan cairan
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-background">
                        area parkir
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-background">
                        lantai licin
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                      <Target className="w-3 h-3" />
                      <span>Interpretasi Makna</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      Gambar menunjukkan tumpahan oli di area parkir yang berpotensi menyebabkan kecelakaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Right Column - Similar Reports */}
          <div className="w-80 flex flex-col bg-muted/10">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">Laporan Mirip (berdasarkan makna)</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semantic">Semantic Tertinggi</SelectItem>
                  <SelectItem value="lexical">Lexical Tertinggi</SelectItem>
                  <SelectItem value="geo">Geo Tertinggi</SelectItem>
                  <SelectItem value="overall">Overall Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {sortedSimilarReports.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Tidak ada laporan mirip lainnya
                  </p>
                ) : (
                  sortedSimilarReports.map((report) => {
                    const score = report.duplicateScores?.semantic || report.duplicateScores?.overall || 0;
                    return (
                      <div
                        key={report.id}
                        className="bg-card rounded-lg p-3 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                        onClick={() => handleReportClick(report)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{report.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {report.tanggal} • {report.pelapor}
                            </p>
                          </div>
                          <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                            {Math.round(score * 100)}%
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="text-[10px] bg-success/20 text-success border-0 gap-1">
                            <Target className="w-2.5 h-2.5" />
                            <Image className="w-2.5 h-2.5" />
                            1 gambar
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center border border-border">
                            <Image className="w-4 h-4 text-muted-foreground/50" />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {report.deskripsiTemuan}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
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