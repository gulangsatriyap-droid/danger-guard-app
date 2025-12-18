import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, ZoomIn, Clock, MapPin, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { HazardReport, similarReports, EvaluationStatus } from "@/data/hazardReports";

const labelConfig = {
  TBC: { bg: "bg-blue-500", text: "text-white", fullName: "TBC - To be Concern Hazard" },
  PSPP: { bg: "bg-orange-500", text: "text-white", fullName: "PSPP - Potensi Safety Performance Problem" },
  GR: { bg: "bg-emerald-500", text: "text-white", fullName: "GR - Golden Rules Violation" }
};

const labelBorderConfig = {
  TBC: "border-l-blue-500",
  PSPP: "border-l-orange-500",
  GR: "border-l-emerald-500"
};

interface ReportDetailProps {
  report: HazardReport;
  onBack: () => void;
  currentIndex: number;
  totalReports: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const ReportDetail = ({ report, onBack, currentIndex, totalReports, onNavigate }: ReportDetailProps) => {
  return (
    <div className="animate-fade-in p-6 overflow-y-auto h-full bg-slate-50">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Evaluator Dashboard
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground">Detail Laporan</span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Informasi Laporan & Lokasi */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Informasi Laporan</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-primary font-medium">ID Laporan</p>
                  <p className="text-sm font-semibold text-foreground">{report.id}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium">Tanggal pembuatan</p>
                  <p className="text-sm text-foreground">{report.tanggalPembuatan}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium">Pelapor</p>
                  <p className="text-sm text-foreground">{report.pelapor} - {report.rolePelapor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Informasi Lokasi</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-primary font-medium">Site</p>
                  <p className="text-sm text-foreground">{report.site}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium">Lokasi</p>
                  <p className="text-sm text-foreground">{report.lokasi}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium">Detail Lokasi</p>
                  <p className="text-sm text-foreground">{report.detailLokasi}</p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    Pin Point Lokasi
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Buka Maps
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-primary font-medium">Latitude</p>
                    <p className="text-sm text-foreground">2.389337</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary font-medium">Longitude</p>
                    <p className="text-sm text-foreground">117.36189</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Deskripsi Objek */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Deskripsi Objek</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-primary font-medium">Ketidaksesuaian</p>
                  <p className="text-sm text-foreground">{report.ketidaksesuaian || report.jenisHazard}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium">Sub ketidaksesuaian</p>
                  <p className="text-sm text-foreground">{report.subKetidaksesuaian || report.subJenisHazard}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-primary font-medium">Quick Action</p>
                <p className="text-sm text-foreground">{report.quickAction}</p>
              </div>

              {/* Deskripsi Temuan with green left border */}
              <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-l-emerald-500">
                <h4 className="font-semibold text-foreground mb-2">Deskripsi Temuan</h4>
                <p className="text-sm text-muted-foreground">{report.deskripsiTemuan}</p>
              </div>

              {/* Evidence Image */}
              <div className="mt-4 relative aspect-video bg-muted rounded-lg overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop" 
                  alt="Bukti temuan" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute bottom-3 right-3 w-8 h-8 bg-card/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Report Output, Status, Pengendalian */}
        <div className="space-y-4">
          {/* AI Report Output */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">AI Report Output</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.labels?.map((label) => {
                  const config = labelConfig[label];
                  return (
                    <span 
                      key={label}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${config.bg} ${config.text}`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {label}
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Status Laporan */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Status Laporan</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Belum dievaluasi</span>
              </div>
              {report.slaDueDate && (
                <p className="text-sm mt-2">
                  <span className="text-muted-foreground">SLA Due </span>
                  <span className="text-destructive font-medium">{report.slaDueDate}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pengendalian */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Pengendalian</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Pilih konfirmasi</label>
                  <Select defaultValue="tutup">
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Pilih aksi" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="tutup">Tutup Laporan</SelectItem>
                      <SelectItem value="proses">Lanjutkan Proses</SelectItem>
                      <SelectItem value="tolak">Tolak Laporan</SelectItem>
                      <SelectItem value="review">Perlu Review Ulang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Selesaikan Evaluasi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Analysis Cards - Bottom Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {report.labels?.map((label, index) => {
          const config = labelConfig[label];
          const borderConfig = labelBorderConfig[label];
          const confidence = report.confidenceScore ? report.confidenceScore - (index * 5) : 90;
          const titles = [
            "Deviasi pengoperasian kendaraan/unit",
            "Pelanggaran Prosedur Keselamatan",
            "Pengoperasian Kendaraan & Unit"
          ];
          
          return (
            <Card key={label} className={`shadow-sm border-l-4 ${borderConfig}`}>
              <CardContent className="p-4">
                {/* Header with badge and confidence */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                      label === 'TBC' ? 'border-blue-500 text-blue-600 bg-blue-50' :
                      label === 'PSPP' ? 'border-orange-500 text-orange-600 bg-orange-50' :
                      'border-emerald-500 text-emerald-600 bg-emerald-50'
                    }`}>
                      {label}
                    </span>
                    <span className="text-sm text-muted-foreground">{config.fullName}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{confidence}%</span>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-foreground mb-2">
                  {index + 1}. {titles[index] || "Analisis Hazard"}
                </h4>

                {/* Deviasi type */}
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="text-primary">Deviasi:</span> Foto
                </p>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {report.deskripsiTemuan ? 
                    `Deskripsi temuan "${report.deskripsiTemuan.substring(0, 80)}${report.deskripsiTemuan.length > 80 ? '...' : ''}"` :
                    "Temuan ini secara langsung berkaitan dengan pengoperasian kendaraan/unit..."
                  }
                </p>

                {/* Detail link */}
                <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <Clock className="w-3 h-3" />
                  Detail Analisis
                  <ChevronRight className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReportDetail;
