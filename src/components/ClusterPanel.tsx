import { useState } from "react";
import { X, FileText, Calendar, User, MapPin, Building, Image, Sparkles, Target, ArrowLeft, Navigation, BookText, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ClusterInfo, hazardReports, HazardReport } from "@/data/hazardReports";

interface ClusterPanelProps {
  cluster: ClusterInfo;
  onClose: () => void;
  onSelectReport: (reportId: string) => void;
}

// Extended dummy data for similar reports per cluster (minimum 5 per cluster)
const clusterDummyReports: Record<string, HazardReport[]> = {
  "C-001": [
    {
      id: "HR-2025-336-23917",
      tanggal: "03 Des 2025",
      pelapor: "Siti Rahayu",
      lokasi: "(B 65) Area Gerbang",
      lokasiKode: "B65",
      jenisHazard: "Pengoperasian Kendaraan",
      subJenisHazard: "Kecepatan berlebih",
      cluster: "C-001",
      site: "BMO 1",
      lokasiArea: "Hauling Road",
      detailLokasi: "Gerbang Utama Site",
      deskripsiTemuan: "LV melaju dengan kecepatan 45 km/jam di area 30 km/jam.",
      quickAction: "Warning Letter",
      tanggalPembuatan: "Budi Santoso",
      rolePelapor: "Gate Keeper",
      ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan / Unit",
      subKetidaksesuaian: "Tidak menggunakan APD sesuai standard",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.87, ruleBased: 0.95, geo: 0.92, lexical: 0.80, semantic: 0.85 },
      longitude: 116.8523,
      latitude: -1.2456
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23920",
      tanggal: "02 Des 2025",
      pelapor: "Bambang Sutrisno",
      lokasi: "(B 65) Area Gerbang",
      lokasiKode: "B65",
      jenisHazard: "Pengoperasian Kendaraan",
      subJenisHazard: "Tidak sabuk pengaman",
      cluster: "C-001",
      site: "BMO 1",
      lokasiArea: "Hauling Road",
      detailLokasi: "Checkpoint 1",
      deskripsiTemuan: "Driver LV tidak menggunakan seatbelt di area gerbang utama.",
      quickAction: "Safety Briefing",
      tanggalPembuatan: "Agus Salim",
      rolePelapor: "Security",
      ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan / Unit",
      subKetidaksesuaian: "Tidak menggunakan seatbelt",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.82, ruleBased: 0.88, geo: 0.90, lexical: 0.75, semantic: 0.80 },
      longitude: 116.8520,
      latitude: -1.2458
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23930",
      tanggal: "01 Des 2025",
      pelapor: "Eka Putra",
      lokasi: "(B 65) Area Gerbang",
      lokasiKode: "B65",
      jenisHazard: "Pengoperasian Kendaraan",
      subJenisHazard: "Speeding",
      cluster: "C-001",
      site: "BMO 1",
      lokasiArea: "Hauling Road",
      detailLokasi: "Gerbang Utama Site",
      deskripsiTemuan: "Kendaraan melaju 50 km/jam di zona 30 km/jam dekat gerbang.",
      quickAction: "Warning",
      tanggalPembuatan: "Rudi Hartono",
      rolePelapor: "Gate Keeper",
      ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan / Unit",
      subKetidaksesuaian: "Kecepatan berlebih di area terbatas",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.91, ruleBased: 0.95, geo: 0.88, lexical: 0.90, semantic: 0.92 },
      longitude: 116.8525,
      latitude: -1.2455
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23931",
      tanggal: "30 Nov 2025",
      pelapor: "Doni Prasetyo",
      lokasi: "(B 65) Area Gerbang",
      lokasiKode: "B65",
      jenisHazard: "Pengoperasian Kendaraan",
      subJenisHazard: "Kecepatan berlebih",
      cluster: "C-001",
      site: "BMO 1",
      lokasiArea: "Hauling Road",
      detailLokasi: "Persimpangan Gerbang",
      deskripsiTemuan: "HD melewati gerbang dengan kecepatan tinggi tanpa berhenti.",
      quickAction: "Warning Letter",
      tanggalPembuatan: "Joko Widodo",
      rolePelapor: "Security",
      ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan / Unit",
      subKetidaksesuaian: "Tidak berhenti di checkpoint",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.78, ruleBased: 0.85, geo: 0.85, lexical: 0.72, semantic: 0.75 },
      longitude: 116.8518,
      latitude: -1.2460
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23932",
      tanggal: "29 Nov 2025",
      pelapor: "Agus Wijaya",
      lokasi: "(B 65) Area Gerbang",
      lokasiKode: "B65",
      jenisHazard: "Pengoperasian Kendaraan",
      subJenisHazard: "Over Speed",
      cluster: "C-001",
      site: "BMO 1",
      lokasiArea: "Hauling Road",
      detailLokasi: "Jalur Angkut Pit Utara",
      deskripsiTemuan: "LV melaju 55 km/jam di zona 30 km/jam dekat gerbang masuk.",
      quickAction: "Suspension",
      tanggalPembuatan: "Hendra Wijaya",
      rolePelapor: "Road Inspector",
      ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan / Unit",
      subKetidaksesuaian: "Pelanggaran batas kecepatan berulang",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.85, ruleBased: 0.92, geo: 0.82, lexical: 0.88, semantic: 0.83 },
      longitude: 116.8530,
      latitude: -1.2450
    } as HazardReport & { longitude?: number; latitude?: number },
  ],
  "C-002": [
    {
      id: "HR-2025-336-23918",
      tanggal: "03 Des 2025",
      pelapor: "Dedi Kurniawan",
      lokasi: "(B 66) Area Galian Coal",
      lokasiKode: "B66",
      jenisHazard: "Perawatan Jalan",
      subJenisHazard: "Jalan berlubang",
      cluster: "C-002",
      site: "BMO 1",
      lokasiArea: "Pit Area",
      detailLokasi: "Pit 3 Section A",
      deskripsiTemuan: "Terdapat lubang berdiameter 50cm di hauling road.",
      quickAction: "Road Maintenance",
      tanggalPembuatan: "Eko Prasetyo",
      rolePelapor: "Road Inspector",
      ketidaksesuaian: "Standar Road Management",
      subKetidaksesuaian: "Kondisi jalan tidak layak",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.82, ruleBased: 0.90, geo: 0.85, lexical: 0.75, semantic: 0.78 },
      longitude: 116.8600,
      latitude: -1.2500
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23940",
      tanggal: "02 Des 2025",
      pelapor: "Rudi Hartono",
      lokasi: "(B 66) Area Galian Coal",
      lokasiKode: "B66",
      jenisHazard: "Perawatan Jalan",
      subJenisHazard: "Jalan rusak",
      cluster: "C-002",
      site: "BMO 1",
      lokasiArea: "Pit Area",
      detailLokasi: "Pit 3 Section B",
      deskripsiTemuan: "Jalan hauling mengalami kerusakan parah akibat hujan.",
      quickAction: "Road Repair",
      tanggalPembuatan: "Budi Santoso",
      rolePelapor: "Road Inspector",
      ketidaksesuaian: "Standar Road Management",
      subKetidaksesuaian: "Drainase tidak berfungsi",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.79, ruleBased: 0.85, geo: 0.88, lexical: 0.70, semantic: 0.75 },
      longitude: 116.8605,
      latitude: -1.2505
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23941",
      tanggal: "01 Des 2025",
      pelapor: "Ahmad Fauzi",
      lokasi: "(B 66) Area Galian Coal",
      lokasiKode: "B66",
      jenisHazard: "Perawatan Jalan",
      subJenisHazard: "Lubang jalan",
      cluster: "C-002",
      site: "BMO 1",
      lokasiArea: "Pit Area",
      detailLokasi: "Pit 3 Section A",
      deskripsiTemuan: "Lubang di jalan hauling sekitar 40cm membahayakan unit.",
      quickAction: "Road Maintenance",
      tanggalPembuatan: "Eka Putra",
      rolePelapor: "Supervisor",
      ketidaksesuaian: "Standar Road Management",
      subKetidaksesuaian: "Pemeliharaan jalan tidak rutin",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.75, ruleBased: 0.80, geo: 0.90, lexical: 0.68, semantic: 0.72 },
      longitude: 116.8602,
      latitude: -1.2502
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23942",
      tanggal: "30 Nov 2025",
      pelapor: "Sinta Dewi",
      lokasi: "(B 66) Area Galian Coal",
      lokasiKode: "B66",
      jenisHazard: "Perawatan Jalan",
      subJenisHazard: "Jalan berlubang",
      cluster: "C-002",
      site: "BMO 1",
      lokasiArea: "Pit Area",
      detailLokasi: "Pit 3 Section C",
      deskripsiTemuan: "Beberapa lubang kecil di sepanjang jalan pit 3.",
      quickAction: "Grading",
      tanggalPembuatan: "Maya Sari",
      rolePelapor: "Road Inspector",
      ketidaksesuaian: "Standar Road Management",
      subKetidaksesuaian: "Grading tidak dilakukan",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.70, ruleBased: 0.75, geo: 0.85, lexical: 0.62, semantic: 0.68 },
      longitude: 116.8608,
      latitude: -1.2508
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23943",
      tanggal: "29 Nov 2025",
      pelapor: "Hendra Saputra",
      lokasi: "(B 66) Area Galian Coal",
      lokasiKode: "B66",
      jenisHazard: "Perawatan Jalan",
      subJenisHazard: "Jalan licin",
      cluster: "C-002",
      site: "BMO 1",
      lokasiArea: "Pit Area",
      detailLokasi: "Pit 3 Section A",
      deskripsiTemuan: "Jalan hauling licin akibat tumpahan oli dari unit HD.",
      quickAction: "Road Cleaning",
      tanggalPembuatan: "Agus Wijaya",
      rolePelapor: "Operator",
      ketidaksesuaian: "Standar Road Management",
      subKetidaksesuaian: "Spillage tidak dibersihkan",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.68, ruleBased: 0.72, geo: 0.82, lexical: 0.58, semantic: 0.65 },
      longitude: 116.8603,
      latitude: -1.2503
    } as HazardReport & { longitude?: number; latitude?: number },
  ],
  "C-005": [
    {
      id: "HR-2025-336-23915",
      tanggal: "04 Des 2025",
      pelapor: "Kamila Iskandar",
      lokasi: "(B 56) Area Transportasi",
      lokasiKode: "B56",
      jenisHazard: "APD",
      subJenisHazard: "Tidak menggunakan APD",
      cluster: "C-005",
      site: "BMO 1",
      lokasiArea: "Hauling Road",
      detailLokasi: "Dumping Di Dekat Air QSV 3 FAD",
      deskripsiTemuan: "Pekerja tidak menggunakan helm saat berada di area konstruksi.",
      quickAction: "Fatigue Test",
      tanggalPembuatan: "Edi Gunawan",
      rolePelapor: "Supervisor/Officer",
      ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan / Unit",
      subKetidaksesuaian: "Tidak menggunakan APD sesuai standard",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.78, ruleBased: 0.85, geo: 0.90, lexical: 0.65, semantic: 0.72 },
      longitude: 116.8700,
      latitude: -1.2600
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23919",
      tanggal: "02 Des 2025",
      pelapor: "Rina Marlina",
      lokasi: "(B 56) Area Transportasi",
      lokasiKode: "B56",
      jenisHazard: "APD",
      subJenisHazard: "Tidak menggunakan APD",
      cluster: "C-005",
      site: "BMO 2",
      lokasiArea: "Loading Point",
      detailLokasi: "Loading Point 2",
      deskripsiTemuan: "Crew tidak menggunakan kacamata safety saat dekat area debu.",
      quickAction: "Coaching",
      tanggalPembuatan: "Joko Widodo",
      rolePelapor: "Supervisor",
      ketidaksesuaian: "APD Tidak Lengkap",
      subKetidaksesuaian: "Tidak menggunakan kacamata safety",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.75, ruleBased: 0.80, geo: 0.70, lexical: 0.72, semantic: 0.78 },
      longitude: 116.8705,
      latitude: -1.2605
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23950",
      tanggal: "01 Des 2025",
      pelapor: "Budi Santoso",
      lokasi: "(B 56) Area Transportasi",
      lokasiKode: "B56",
      jenisHazard: "APD",
      subJenisHazard: "Helm tidak dipakai",
      cluster: "C-005",
      site: "BMO 1",
      lokasiArea: "Hauling Road",
      detailLokasi: "Area Konstruksi Utama",
      deskripsiTemuan: "Operator tidak memakai helm safety di area kerja konstruksi.",
      quickAction: "Warning",
      tanggalPembuatan: "Eka Putra",
      rolePelapor: "Safety Officer",
      ketidaksesuaian: "APD Tidak Lengkap",
      subKetidaksesuaian: "Tidak menggunakan helm",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.88, ruleBased: 0.92, geo: 0.85, lexical: 0.82, semantic: 0.90 },
      longitude: 116.8702,
      latitude: -1.2602
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23951",
      tanggal: "30 Nov 2025",
      pelapor: "Ahmad Wijaya",
      lokasi: "(B 56) Area Transportasi",
      lokasiKode: "B56",
      jenisHazard: "APD",
      subJenisHazard: "Safety vest tidak dipakai",
      cluster: "C-005",
      site: "BMO 1",
      lokasiArea: "Hauling Road",
      detailLokasi: "Dumping Area",
      deskripsiTemuan: "Pekerja tidak menggunakan safety vest saat turun dari unit.",
      quickAction: "Safety Briefing",
      tanggalPembuatan: "Rudi Hartono",
      rolePelapor: "Supervisor",
      ketidaksesuaian: "APD Tidak Lengkap",
      subKetidaksesuaian: "Tidak menggunakan safety vest",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.72, ruleBased: 0.78, geo: 0.88, lexical: 0.65, semantic: 0.70 },
      longitude: 116.8708,
      latitude: -1.2608
    } as HazardReport & { longitude?: number; latitude?: number },
    {
      id: "HR-2025-336-23952",
      tanggal: "29 Nov 2025",
      pelapor: "Sinta Dewi",
      lokasi: "(B 56) Area Transportasi",
      lokasiKode: "B56",
      jenisHazard: "APD",
      subJenisHazard: "APD tidak lengkap",
      cluster: "C-005",
      site: "BMO 2",
      lokasiArea: "Loading Point",
      detailLokasi: "Loading Point 1",
      deskripsiTemuan: "Karyawan bekerja tanpa sarung tangan di area material berbahaya.",
      quickAction: "Coaching",
      tanggalPembuatan: "Dedi Kurniawan",
      rolePelapor: "Safety Officer",
      ketidaksesuaian: "APD Tidak Lengkap",
      subKetidaksesuaian: "Tidak menggunakan sarung tangan",
      aiStatus: "AI_SELESAI",
      duplicateScores: { overall: 0.68, ruleBased: 0.72, geo: 0.65, lexical: 0.70, semantic: 0.65 },
      longitude: 116.8710,
      latitude: -1.2610
    } as HazardReport & { longitude?: number; latitude?: number },
  ]
};

// Add type extension for coordinates
interface ExtendedHazardReport extends HazardReport {
  longitude?: number;
  latitude?: number;
}

const ClusterPanel = ({ cluster, onClose, onSelectReport }: ClusterPanelProps) => {
  const [sortBy, setSortBy] = useState("semantic");
  const [selectedCompareReport, setSelectedCompareReport] = useState<ExtendedHazardReport | null>(null);
  
  // Get reports from dummy data or fallback to hazardReports
  const clusterReports = clusterDummyReports[cluster.id] || hazardReports.filter(r => r.cluster === cluster.id);
  
  // First report is the representative
  const representativeReport = clusterReports[0] as ExtendedHazardReport;
  const similarReports = clusterReports.slice(1) as ExtendedHazardReport[];

  const getScoreColor = (score: number) => {
    if (score >= 0.75) return "text-destructive";
    if (score >= 0.5) return "text-warning";
    return "text-success";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.75) return "bg-destructive/10 text-destructive";
    if (score >= 0.5) return "bg-warning/10 text-warning";
    return "bg-success/10 text-success";
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

  const handleReportClick = (report: ExtendedHazardReport) => {
    setSelectedCompareReport(report);
  };

  const handleBackToList = () => {
    setSelectedCompareReport(null);
  };

  if (!representativeReport) return null;

  // Comparison View - Side by side with equal ratio
  if (selectedCompareReport) {
    const repScore = representativeReport.duplicateScores;
    const compScore = selectedCompareReport.duplicateScores;
    
    const renderReportColumn = (report: ExtendedHazardReport, label: string, isRepresentative: boolean) => (
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-4">
          {/* Report Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{label}</span>
              {isRepresentative && (
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  Representative
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {report.id}
            </Badge>
          </div>

          {/* Report Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{report.tanggal}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{report.pelapor}</span>
            </div>
          </div>

          {/* Site & Location Info */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              <Building className="w-3 h-3 mr-1" />
              {report.site}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {report.lokasiArea || report.lokasi}
            </span>
          </div>

          {/* Asal Cluster */}
          <div className="text-xs">
            <span className="text-muted-foreground">Asal Cluster</span>
            <p className="text-foreground mt-0.5">{report.cluster ? `Cluster ${report.cluster}` : "Tidak ada cluster sebelumnya"}</p>
          </div>

          {/* Deskripsi Temuan */}
          <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <FileText className="w-3 h-3" />
              <span>Deskripsi Temuan</span>
            </div>
            <p className="text-sm text-foreground">{report.deskripsiTemuan}</p>
          </div>

          {/* Gambar Temuan */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Image className="w-3 h-3" />
              <span>Gambar Temuan (1)</span>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
              <Image className="w-12 h-12 text-muted-foreground/30" />
            </div>
          </div>

          {/* Expandable Analysis Sections */}
          <div className="space-y-2">
            {/* SEMANTIC ANALYSIS - Expandable */}
            <Collapsible defaultOpen>
              <div className="bg-primary/5 rounded-lg border border-primary/20 overflow-hidden">
                <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm text-primary">Analisis Semantik</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.duplicateScores && (
                      <Badge className={`text-xs ${getScoreBgColor(report.duplicateScores.semantic)}`}>
                        {Math.round(report.duplicateScores.semantic * 100)}%
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-3">
                    {/* Sinyal Visual Terdeteksi */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <Target className="w-3 h-3" />
                        <span>Sinyal Visual Terdeteksi</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs bg-background">
                          {report.jenisHazard?.toLowerCase() || "hazard terdeteksi"}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-background">
                          {report.lokasiArea?.toLowerCase() || "area kerja"}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-background">
                          kondisi tidak aman
                        </Badge>
                      </div>
                    </div>
                    {/* Interpretasi Makna */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Interpretasi Makna</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        Gambar menunjukkan {report.subJenisHazard?.toLowerCase() || "kondisi berbahaya"} di {report.detailLokasi?.toLowerCase() || "area kerja"} yang berpotensi menyebabkan kecelakaan.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* GEO ANALYSIS - Expandable */}
            <Collapsible>
              <div className="bg-success/5 rounded-lg border border-success/20 overflow-hidden">
                <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-success/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-success" />
                    <span className="font-medium text-sm text-success">Analisis Geo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.duplicateScores && (
                      <Badge className={`text-xs ${getScoreBgColor(report.duplicateScores.geo)}`}>
                        {Math.round(report.duplicateScores.geo * 100)}%
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Site</span>
                        <p className="text-sm font-medium text-foreground mt-0.5">{report.site}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Lokasi</span>
                        <p className="text-sm font-medium text-foreground mt-0.5">{report.lokasiArea || report.lokasi}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Detail Lokasi</span>
                      <p className="text-sm font-medium text-foreground mt-0.5">{report.detailLokasi}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Longitude</span>
                        <p className="text-sm font-medium text-foreground mt-0.5">{report.longitude || "116.8523"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Latitude</span>
                        <p className="text-sm font-medium text-foreground mt-0.5">{report.latitude || "-1.2456"}</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* LEXICAL ANALYSIS - Expandable */}
            <Collapsible>
              <div className="bg-warning/5 rounded-lg border border-warning/20 overflow-hidden">
                <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-warning/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <BookText className="w-4 h-4 text-warning" />
                    <span className="font-medium text-sm text-warning">Analisis Lexical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.duplicateScores && (
                      <Badge className={`text-xs ${getScoreBgColor(report.duplicateScores.lexical)}`}>
                        {Math.round(report.duplicateScores.lexical * 100)}%
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Ketidaksesuaian</span>
                      <p className="text-sm font-medium text-foreground mt-0.5">{report.ketidaksesuaian || report.jenisHazard}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Sub Ketidaksesuaian</span>
                      <p className="text-sm font-medium text-foreground mt-0.5">{report.subKetidaksesuaian || report.subJenisHazard}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Quick Action</span>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {report.quickAction}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
      </ScrollArea>
    );
    
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end">
        <div className="bg-card w-full max-w-6xl h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
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
                <p className="text-sm text-muted-foreground">Mode Perbandingan Laporan</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Similarity Summary */}
          <div className="px-5 py-3 border-b border-border bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Ringkasan Kemiripan
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">Geo:</span>
                <span className="font-semibold text-foreground">
                  {Math.round((compScore?.geo || 0) * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookText className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground">Lexical:</span>
                <span className="font-semibold text-foreground">
                  {Math.round((compScore?.lexical || 0) * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Semantic:</span>
                <span className="font-semibold text-foreground">
                  {Math.round((compScore?.semantic || 0) * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">Overall:</span>
                <Badge className={getScoreBgColor(compScore?.overall || 0)}>
                  {Math.round((compScore?.overall || 0) * 100)}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Two Column Comparison - Equal Ratio */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column - Laporan Utama (Representative) */}
            <div className="flex-1 border-r border-border">
              {renderReportColumn(representativeReport, "Laporan Utama (A)", true)}
            </div>

            {/* Right Column - Laporan Pembanding */}
            <div className="flex-1">
              {renderReportColumn(selectedCompareReport, "Laporan Pembanding (B)", false)}
            </div>
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

  // List View (Default) - Equal ratio columns
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-card w-full max-w-6xl h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Semantic Review</h3>
              <p className="text-sm text-muted-foreground">Analisis Cluster: {cluster.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Two Column Content - Equal Ratio */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Representative Report */}
          <ScrollArea className="flex-1 border-r border-border">
            <div className="p-5 space-y-4">
              {/* Main Report Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-foreground">Laporan Utama</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    Representative
                  </Badge>
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

              {/* Site & Location Info */}
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  <Building className="w-3 h-3 mr-1" />
                  {representativeReport.site}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {representativeReport.lokasiArea || representativeReport.lokasi}
                </span>
              </div>

              {/* Asal Cluster */}
              <div className="text-xs">
                <span className="text-muted-foreground">Asal Cluster</span>
                <p className="text-foreground mt-0.5">{representativeReport.cluster ? `Cluster ${representativeReport.cluster}` : "Tidak ada cluster sebelumnya"}</p>
              </div>

              {/* Deskripsi Temuan */}
              <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <FileText className="w-3 h-3" />
                  <span>Deskripsi Temuan</span>
                </div>
                <p className="text-sm text-foreground">{representativeReport.deskripsiTemuan}</p>
              </div>

              {/* Gambar Temuan */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Image className="w-3 h-3" />
                  <span>Gambar Temuan (1)</span>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                  <Image className="w-12 h-12 text-muted-foreground/30" />
                </div>
              </div>

              {/* Expandable Analysis Sections */}
              <div className="space-y-2">
                {/* SEMANTIC ANALYSIS - Expandable */}
                <Collapsible defaultOpen>
                  <div className="bg-primary/5 rounded-lg border border-primary/20 overflow-hidden">
                    <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-primary/10 transition-colors">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm text-primary">Analisis Semantik</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 space-y-3">
                        {/* Sinyal Visual Terdeteksi */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                            <Target className="w-3 h-3" />
                            <span>Sinyal Visual Terdeteksi</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs bg-background">
                              {representativeReport.jenisHazard?.toLowerCase() || "hazard terdeteksi"}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-background">
                              {representativeReport.lokasiArea?.toLowerCase() || "area kerja"}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-background">
                              kondisi tidak aman
                            </Badge>
                          </div>
                        </div>
                        {/* Interpretasi Makna */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Interpretasi Makna</span>
                          </div>
                          <p className="text-xs text-muted-foreground italic">
                            Gambar menunjukkan {representativeReport.subJenisHazard?.toLowerCase() || "kondisi berbahaya"} di {representativeReport.detailLokasi?.toLowerCase() || "area kerja"} yang berpotensi menyebabkan kecelakaan.
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                {/* GEO ANALYSIS - Expandable */}
                <Collapsible>
                  <div className="bg-success/5 rounded-lg border border-success/20 overflow-hidden">
                    <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-success/10 transition-colors">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-success" />
                        <span className="font-medium text-sm text-success">Analisis Geo</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-muted-foreground">Site</span>
                            <p className="text-sm font-medium text-foreground mt-0.5">{representativeReport.site}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Lokasi</span>
                            <p className="text-sm font-medium text-foreground mt-0.5">{representativeReport.lokasiArea || representativeReport.lokasi}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Detail Lokasi</span>
                          <p className="text-sm font-medium text-foreground mt-0.5">{representativeReport.detailLokasi}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-muted-foreground">Longitude</span>
                            <p className="text-sm font-medium text-foreground mt-0.5">{representativeReport.longitude || "116.8523"}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Latitude</span>
                            <p className="text-sm font-medium text-foreground mt-0.5">{representativeReport.latitude || "-1.2456"}</p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                {/* LEXICAL ANALYSIS - Expandable */}
                <Collapsible>
                  <div className="bg-warning/5 rounded-lg border border-warning/20 overflow-hidden">
                    <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-warning/10 transition-colors">
                      <div className="flex items-center gap-2">
                        <BookText className="w-4 h-4 text-warning" />
                        <span className="font-medium text-sm text-warning">Analisis Lexical</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 space-y-2">
                        <div>
                          <span className="text-xs text-muted-foreground">Ketidaksesuaian</span>
                          <p className="text-sm font-medium text-foreground mt-0.5">{representativeReport.ketidaksesuaian || representativeReport.jenisHazard}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Sub Ketidaksesuaian</span>
                          <p className="text-sm font-medium text-foreground mt-0.5">{representativeReport.subKetidaksesuaian || representativeReport.subJenisHazard}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Quick Action</span>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              {representativeReport.quickAction}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
            </div>
          </ScrollArea>

          {/* Right Column - Similar Reports */}
          <div className="flex-1 flex flex-col bg-muted/10">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">Laporan Mirip ({sortedSimilarReports.length})</span>
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
                    const score = sortBy === "semantic" ? report.duplicateScores?.semantic : 
                                  sortBy === "lexical" ? report.duplicateScores?.lexical :
                                  sortBy === "geo" ? report.duplicateScores?.geo :
                                  report.duplicateScores?.overall || 0;
                    return (
                      <div
                        key={report.id}
                        className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                        onClick={() => handleReportClick(report)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{report.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {report.tanggal} • {report.pelapor}
                            </p>
                          </div>
                          <Badge className={getScoreBgColor(score || 0)}>
                            {Math.round((score || 0) * 100)}%
                          </Badge>
                        </div>

                        {/* Score breakdown mini */}
                        <div className="flex items-center gap-3 mb-2 text-xs">
                          <span className="text-success">
                            G: {Math.round((report.duplicateScores?.geo || 0) * 100)}%
                          </span>
                          <span className="text-warning">
                            L: {Math.round((report.duplicateScores?.lexical || 0) * 100)}%
                          </span>
                          <span className="text-primary">
                            S: {Math.round((report.duplicateScores?.semantic || 0) * 100)}%
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="text-[10px] bg-success/20 text-success border-0 gap-1">
                            <Image className="w-2.5 h-2.5" />
                            1 gambar
                          </Badge>
                          <Badge variant="outline" className="text-[10px] gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            {report.site}
                          </Badge>
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
