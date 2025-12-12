export interface AIKnowledgeSource {
  type: 'TBC' | 'PSPP' | 'GR';
  label: string;
  category: string;
  categoryNumber: number;
  confidence: number;
  reasoning: string;
  citation: {
    title: string;
    content: string;
  };
}

export interface ClusterInfo {
  id: string;
  name: string;
  reportCount: number;
  similarityScore: number;
  status: 'Duplikat Kuat' | 'Duplikat Mungkin' | 'Bukan Duplikat';
  components: {
    locationRadius: number;
    locationName: number;
    detailLocation: number;
    locationDescription: number;
    nonCompliance: number;
    subNonCompliance: number;
    imageContext: number;
    findingDescription: number;
  };
}

// AI Processing Status (only for Antrian AI)
export type AIStatus = 'MENUNGGU_ANALISIS_AI' | 'SEDANG_ANALISIS_AI' | 'AI_GAGAL' | 'AI_SELESAI';

// Evaluation Status (only for Daftar Laporan post-AI)
export type EvaluationStatus = 'BELUM_DIEVALUASI' | 'DALAM_EVALUASI' | 'SELESAI' | 'PERLU_REVIEW_ULANG';

// SLA Status
export type SLAStatus = 'hijau' | 'kuning' | 'merah';

export interface HazardReport {
  id: string;
  tanggal: string;
  pelapor: string;
  lokasi: string;
  lokasiKode: string;
  jenisHazard: string;
  subJenisHazard: string;
  cluster: string | null;
  site: string;
  lokasiArea?: string;
  detailLokasi: string;
  deskripsi?: string;
  deskripsiTemuan: string;
  quickAction: string;
  tanggalPembuatan: string;
  rolePelapor: string;
  
  // Ketidaksesuaian fields
  ketidaksesuaian?: string;
  subKetidaksesuaian?: string;
  
  // AI Pipeline fields
  aiStatus: AIStatus;
  aiBatch?: string;
  etaSiapEvaluasi?: string;
  timestamp?: string; // ISO timestamp for queue ordering
  
  // Post-AI fields (populated when aiStatus = AI_SELESAI)
  labels?: ('TBC' | 'PSPP' | 'GR')[];
  confidenceScore?: number;
  aiKnowledgeSources?: AIKnowledgeSource[];
  clusterSuggestion?: string;
  
  // Evaluation fields
  evaluationStatus?: EvaluationStatus;
  evaluatorName?: string;
  slaStatus?: SLAStatus;
  slaDueDate?: string;
  assignedTo?: string;
}

// Cluster data with similarity scoring based on the clustering rules
export const reportClusters: ClusterInfo[] = [
  {
    id: "C-001",
    name: "Pelanggaran Kecepatan Area Gerbang",
    reportCount: 12,
    similarityScore: 0.87,
    status: "Duplikat Kuat",
    components: {
      locationRadius: 1,
      locationName: 1,
      detailLocation: 0.5,
      locationDescription: 0.8,
      nonCompliance: 1,
      subNonCompliance: 1,
      imageContext: 0.7,
      findingDescription: 0.9
    }
  },
  {
    id: "C-002",
    name: "Kondisi Jalan Berlubang Pit 3",
    reportCount: 8,
    similarityScore: 0.82,
    status: "Duplikat Kuat",
    components: {
      locationRadius: 1,
      locationName: 1,
      detailLocation: 1,
      locationDescription: 0.9,
      nonCompliance: 1,
      subNonCompliance: 0.5,
      imageContext: 0.6,
      findingDescription: 0.8
    }
  },
  {
    id: "C-003",
    name: "Retakan Highwall Pit 2",
    reportCount: 5,
    similarityScore: 0.91,
    status: "Duplikat Kuat",
    components: {
      locationRadius: 1,
      locationName: 1,
      detailLocation: 1,
      locationDescription: 1,
      nonCompliance: 1,
      subNonCompliance: 1,
      imageContext: 0.8,
      findingDescription: 0.7
    }
  },
  {
    id: "C-004",
    name: "APD Tidak Lengkap Workshop",
    reportCount: 15,
    similarityScore: 0.65,
    status: "Duplikat Mungkin",
    components: {
      locationRadius: 0.5,
      locationName: 0.5,
      detailLocation: 0.5,
      locationDescription: 0.6,
      nonCompliance: 1,
      subNonCompliance: 0.5,
      imageContext: 0.5,
      findingDescription: 0.7
    }
  },
  {
    id: "C-005",
    name: "Helm Safety Area Konstruksi",
    reportCount: 22,
    similarityScore: 0.78,
    status: "Duplikat Kuat",
    components: {
      locationRadius: 0.5,
      locationName: 1,
      detailLocation: 0.5,
      locationDescription: 0.8,
      nonCompliance: 1,
      subNonCompliance: 1,
      imageContext: 0.9,
      findingDescription: 0.85
    }
  }
];

// Location data for dropdowns
export const siteOptions = [
  "MINING PIT",
  "MARINE",
  "PROCESSING PLANT",
  "CAMP AREA",
  "OFFICE AREA"
];

export const lokasiOptions: Record<string, string[]> = {
  "MINING PIT": ["Hauling Road", "Pit Area", "Disposal Area", "Loading Point"],
  "MARINE": ["Fuel Transfer Area", "Jetty", "Barge Loading", "Port Office"],
  "PROCESSING PLANT": ["Crusher", "Conveyor Belt", "Stockpile", "Weighbridge"],
  "CAMP AREA": ["Mess Hall", "Dormitory", "Recreation Area", "Parking Lot"],
  "OFFICE AREA": ["Main Office", "Workshop", "Warehouse", "Gate"]
};

export const detailLokasiOptions: Record<string, string[]> = {
  "Hauling Road": ["Jalur Angkut Pit Selatan", "Jalur Angkut Pit Utara", "Persimpangan Utama"],
  "Pit Area": ["Pit 1 Section A", "Pit 2 Section B", "Pit 3 Section C"],
  "Disposal Area": ["Disposal Utama", "Disposal Cadangan"],
  "Loading Point": ["Loading Point 1", "Loading Point 2", "Loading Point 3"],
  "Fuel Transfer Area": ["Fuel Hose Connection Point", "Fuel Storage Tank", "Pump Station"],
  "Jetty": ["Jetty Utama", "Jetty Cadangan", "Dermaga Bongkar"],
  "Barge Loading": ["Conveyor Loading", "Crane Area", "Barge Parking"],
  "Port Office": ["Ruang Kontrol", "Ruang Operator", "Area Parkir"],
  "Crusher": ["Primary Crusher", "Secondary Crusher", "Tertiary Crusher"],
  "Conveyor Belt": ["Conveyor Utama", "Conveyor Transfer", "Conveyor Emergency"],
  "Stockpile": ["Stockpile A", "Stockpile B", "Reclaim Area"],
  "Weighbridge": ["Weighbridge 1", "Weighbridge 2"],
  "Mess Hall": ["Ruang Makan", "Dapur", "Area Cuci"],
  "Dormitory": ["Blok A", "Blok B", "Blok C"],
  "Recreation Area": ["Lapangan Olahraga", "Gym", "Ruang Santai"],
  "Parking Lot": ["Parkir Utama", "Parkir Tamu"],
  "Main Office": ["Lantai 1", "Lantai 2", "Ruang Meeting"],
  "Workshop": ["Workshop Utama", "Workshop Elektrik", "Workshop Mekanik"],
  "Warehouse": ["Gudang Spare Part", "Gudang Material", "Gudang BBM"],
  "Gate": ["Gerbang Utama", "Gerbang Belakang", "Pos Jaga"]
};

// Reports in AI Queue (Pre-Processing)
export const aiQueueReports: HazardReport[] = [
  {
    id: "HR-2025-336-24002",
    tanggal: "12 Des 2025",
    pelapor: "Sinta Dewi",
    lokasi: "(B 65) Area Gerbang",
    lokasiKode: "B65",
    jenisHazard: "",
    subJenisHazard: "",
    cluster: null,
    site: "MINING PIT",
    lokasiArea: "Hauling Road",
    detailLokasi: "Jalur Angkut Pit Selatan",
    deskripsiTemuan: "Pending AI analysis...",
    quickAction: "-",
    tanggalPembuatan: "12 Des 2025",
    rolePelapor: "Security",
    ketidaksesuaian: "DDP : Kelayakan dan Pengoperasian Kendaraan / Unit",
    subKetidaksesuaian: "Tidak menggunakan APD sesuai standard",
    aiStatus: "SEDANG_ANALISIS_AI",
    timestamp: "2025-12-12T06:15:00Z"
  },
  {
    id: "HR-2025-336-24001",
    tanggal: "12 Des 2025",
    pelapor: "Rizki Pratama",
    lokasi: "(B 56) Area Transportasi",
    lokasiKode: "B56",
    jenisHazard: "",
    subJenisHazard: "",
    cluster: null,
    site: "MARINE",
    lokasiArea: "Fuel Transfer Area",
    detailLokasi: "Fuel Hose Connection Point",
    deskripsiTemuan: "Pending AI analysis...",
    quickAction: "-",
    tanggalPembuatan: "12 Des 2025",
    rolePelapor: "Operator",
    ketidaksesuaian: "Pembelian, Penanganan bahan dan kendali bahan",
    subKetidaksesuaian: "Penyimpanan bahan tidak tepat",
    aiStatus: "MENUNGGU_ANALISIS_AI",
    timestamp: "2025-12-12T06:20:00Z"
  },
  {
    id: "HR-2025-336-24003",
    tanggal: "12 Des 2025",
    pelapor: "Hendra Saputra",
    lokasi: "(B 66) Area Galian Coal",
    lokasiKode: "B66",
    jenisHazard: "",
    subJenisHazard: "",
    cluster: null,
    site: "PROCESSING PLANT",
    lokasiArea: "Crusher",
    detailLokasi: "Primary Crusher",
    deskripsiTemuan: "Pending AI analysis...",
    quickAction: "-",
    tanggalPembuatan: "12 Des 2025",
    rolePelapor: "Supervisor",
    ketidaksesuaian: "Kelayakan/Penggunaan Tools",
    subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools",
    aiStatus: "MENUNGGU_ANALISIS_AI",
    timestamp: "2025-12-12T06:25:00Z"
  },
  {
    id: "HR-2025-336-24005",
    tanggal: "12 Des 2025",
    pelapor: "Ahmad Fauzi",
    lokasi: "(B 65) Area Gerbang",
    lokasiKode: "B65",
    jenisHazard: "",
    subJenisHazard: "",
    cluster: null,
    site: "MINING PIT",
    lokasiArea: "Pit Area",
    detailLokasi: "Pit 1 Section A",
    deskripsiTemuan: "Pending AI analysis...",
    quickAction: "-",
    tanggalPembuatan: "12 Des 2025",
    rolePelapor: "Gate Keeper",
    ketidaksesuaian: "Perlengkapan_Mesin_atau_Peralatan",
    subKetidaksesuaian: "Pelepasan komponen-komponen yang tidak memadai",
    aiStatus: "MENUNGGU_ANALISIS_AI",
    timestamp: "2025-12-12T06:30:00Z"
  },
  {
    id: "HR-2025-336-24006",
    tanggal: "12 Des 2025",
    pelapor: "Budi Santoso",
    lokasi: "(B 67) Area Workshop",
    lokasiKode: "B67",
    jenisHazard: "",
    subJenisHazard: "",
    cluster: null,
    site: "OFFICE AREA",
    lokasiArea: "Workshop",
    detailLokasi: "Workshop Utama",
    deskripsiTemuan: "Pending AI analysis...",
    quickAction: "-",
    tanggalPembuatan: "12 Des 2025",
    rolePelapor: "Teknisi",
    ketidaksesuaian: "Perlengkapan_Mesin_atau_Peralatan",
    subKetidaksesuaian: "Penyesuaian / perbaikan / pemeliharaan yang tidak memadai",
    aiStatus: "MENUNGGU_ANALISIS_AI",
    timestamp: "2025-12-12T06:35:00Z"
  },
  {
    id: "HR-2025-336-24008",
    tanggal: "12 Des 2025",
    pelapor: "Agus Wijaya",
    lokasi: "(B 69) Jalan Hauling",
    lokasiKode: "B69",
    jenisHazard: "",
    subJenisHazard: "",
    cluster: null,
    site: "MINING PIT",
    lokasiArea: "Hauling Road",
    detailLokasi: "Jalur Angkut Pit Utara",
    deskripsiTemuan: "Pending AI analysis...",
    quickAction: "-",
    tanggalPembuatan: "12 Des 2025",
    rolePelapor: "Road Inspector",
    ketidaksesuaian: "Standar Road Management",
    subKetidaksesuaian: "Drainase tersumbat pada jalan angkut",
    aiStatus: "MENUNGGU_ANALISIS_AI",
    timestamp: "2025-12-12T06:40:00Z"
  },
  {
    id: "HR-2025-336-24010",
    tanggal: "12 Des 2025",
    pelapor: "Eka Putra",
    lokasi: "(B 71) Area Listrik",
    lokasiKode: "B71",
    jenisHazard: "",
    subJenisHazard: "",
    cluster: null,
    site: "MARINE",
    lokasiArea: "Jetty",
    detailLokasi: "Jetty Utama",
    deskripsiTemuan: "Pending AI analysis...",
    quickAction: "-",
    tanggalPembuatan: "12 Des 2025",
    rolePelapor: "Electrical Engineer",
    ketidaksesuaian: "Bahaya Elektrikal",
    subKetidaksesuaian: "Pengamanan peralatan listrik tidak memadai",
    aiStatus: "MENUNGGU_ANALISIS_AI",
    timestamp: "2025-12-12T06:45:00Z"
  }
];

// Reports ready for evaluation (Post-AI)
export const hazardReports: HazardReport[] = [
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
    timestamp: "2025-12-04T08:30:00Z",
    labels: ['TBC', 'PSPP', 'GR'],
    confidenceScore: 95,
    evaluationStatus: "BELUM_DIEVALUASI",
    slaStatus: "hijau",
    slaDueDate: "10 Des 2025",
    clusterSuggestion: "C-005",
    aiKnowledgeSources: [
      {
        type: 'TBC',
        label: 'TBC - To be Concern Hazard',
        category: 'Deviasi pengoperasian kendaraan/unit',
        categoryNumber: 1,
        confidence: 95,
        reasoning: 'Temuan ini secara langsung berkaitan dengan pengoperasian kendaraan/unit.',
        citation: {
          title: 'TBC - To be Concern Hazard Guidelines',
          content: 'Kategori 1: Deviasi pengoperasian kendaraan/unit'
        }
      },
      {
        type: 'PSPP',
        label: 'PSPP - Peraturan Sanksi Pelanggaran Prosedur',
        category: 'Pelanggaran Prosedur Keselamatan',
        categoryNumber: 4,
        confidence: 90,
        reasoning: 'Deskripsi temuan mengindikasikan adanya potensi bahaya.',
        citation: {
          title: 'PSPP - Peraturan Sanksi Pelanggaran Prosedur',
          content: 'Pasal 4: Pelanggaran Prosedur Keselamatan'
        }
      },
      {
        type: 'GR',
        label: 'Safety Golden Rules',
        category: 'Pengoperasian Kendaraan & Unit',
        categoryNumber: 2,
        confidence: 90,
        reasoning: 'Deskripsi temuan berkaitan dengan aturan pengoperasian kendaraan dan unit.',
        citation: {
          title: 'Safety Golden Rules - Pengoperasian Kendaraan & Unit',
          content: 'Golden Rule #2: Pengoperasian Kendaraan & Unit'
        }
      }
    ]
  },
  {
    id: "HR-2025-336-23916",
    tanggal: "04 Des 2025",
    pelapor: "Ahmad Wijaya",
    lokasi: "(B 56) Area Transportasi",
    lokasiKode: "B56",
    jenisHazard: "APD",
    subJenisHazard: "APD tidak lengkap",
    cluster: "C-004",
    site: "BMO 2",
    lokasiArea: "Pit Area",
    detailLokasi: "Area Dumping Utama",
    deskripsiTemuan: "Operator HD tidak menggunakan safety vest saat keluar dari unit.",
    quickAction: "Safety Briefing",
    tanggalPembuatan: "Rudi Hartono",
    rolePelapor: "Safety Officer",
    ketidaksesuaian: "Perlengkapan_Mesin_atau_Peralatan",
    subKetidaksesuaian: "Penyesuaian / perbaikan / pemeliharaan yang tidak memadai",
    aiStatus: "AI_SELESAI",
    timestamp: "2025-12-04T09:15:00Z",
    labels: ['TBC'],
    confidenceScore: 88,
    evaluationStatus: "BELUM_DIEVALUASI",
    slaStatus: "kuning",
    slaDueDate: "09 Des 2025"
  },
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
    timestamp: "2025-12-03T07:45:00Z",
    labels: ['PSPP', 'GR'],
    confidenceScore: 92,
    evaluationStatus: "DALAM_EVALUASI",
    evaluatorName: "Andi Supervisor",
    slaStatus: "hijau",
    slaDueDate: "11 Des 2025",
    assignedTo: "Andi Supervisor"
  },
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
    subKetidaksesuaian: "Drainase tersumbat pada jalan angkut",
    aiStatus: "AI_SELESAI",
    timestamp: "2025-12-03T10:20:00Z",
    labels: ['GR'],
    confidenceScore: 85,
    evaluationStatus: "SELESAI",
    evaluatorName: "Budi Evaluator",
    slaStatus: "hijau",
    slaDueDate: "08 Des 2025"
  },
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
    ketidaksesuaian: "Pembelian, Penanganan bahan dan kendali bahan",
    subKetidaksesuaian: "Penyimpanan bahan tidak tepat",
    aiStatus: "AI_SELESAI",
    timestamp: "2025-12-02T14:30:00Z",
    labels: ['TBC', 'PSPP'],
    confidenceScore: 91,
    evaluationStatus: "BELUM_DIEVALUASI",
    slaStatus: "merah",
    slaDueDate: "07 Des 2025"
  },
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
    lokasiArea: "Disposal Area",
    detailLokasi: "Checkpoint 1",
    deskripsiTemuan: "Driver LV tidak menggunakan seatbelt.",
    quickAction: "Safety Briefing",
    tanggalPembuatan: "Agus Salim",
    rolePelapor: "Security",
    ketidaksesuaian: "Kelayakan/Penggunaan Tools",
    subKetidaksesuaian: "Kesesuaian penggunaan Supporting Tools",
    aiStatus: "AI_SELESAI",
    timestamp: "2025-12-02T11:00:00Z",
    labels: ['PSPP', 'GR'],
    confidenceScore: 89,
    evaluationStatus: "SELESAI",
    evaluatorName: "Citra Evaluator",
    slaStatus: "hijau",
    slaDueDate: "08 Des 2025"
  },
  {
    id: "HR-2025-336-23921",
    tanggal: "01 Des 2025",
    pelapor: "Maya Sari",
    lokasi: "(B 66) Area Galian Coal",
    lokasiKode: "B66",
    jenisHazard: "Kondisi Area",
    subJenisHazard: "Material longsor",
    cluster: "C-003",
    site: "BMO 1",
    lokasiArea: "Pit Area",
    detailLokasi: "Highwall Pit 2",
    deskripsiTemuan: "Terdapat retakan di highwall yang berpotensi longsor.",
    quickAction: "Area Closure",
    tanggalPembuatan: "Hendra Wijaya",
    rolePelapor: "Geotechnical",
    ketidaksesuaian: "Bahaya Elektrikal",
    subKetidaksesuaian: "Pengamanan peralatan listrik tidak memadai",
    aiStatus: "AI_SELESAI",
    timestamp: "2025-12-01T16:45:00Z",
    labels: ['GR'],
    confidenceScore: 94,
    evaluationStatus: "DALAM_EVALUASI",
    evaluatorName: "Doni Evaluator",
    slaStatus: "kuning",
    slaDueDate: "09 Des 2025",
    assignedTo: "Doni Evaluator"
  },
  {
    id: "HR-2025-336-23922",
    tanggal: "01 Des 2025",
    pelapor: "Andi Pratama",
    lokasi: "(B 56) Area Transportasi",
    lokasiKode: "B56",
    jenisHazard: "APD",
    subJenisHazard: "Tidak menggunakan APD",
    cluster: "C-004",
    site: "BMO 2",
    lokasiArea: "Workshop",
    detailLokasi: "Workshop Area",
    deskripsiTemuan: "Mekanik tidak menggunakan sarung tangan saat handling oli.",
    quickAction: "Coaching",
    tanggalPembuatan: "Surya Dharma",
    rolePelapor: "Supervisor",
    ketidaksesuaian: "Kelengkapan tanggap darurat",
    subKetidaksesuaian: "Alat Tanggap Darurat belum dilakukan inspeksi",
    aiStatus: "AI_SELESAI",
    timestamp: "2025-12-01T09:30:00Z",
    labels: ['TBC'],
    confidenceScore: 87,
    evaluationStatus: "PERLU_REVIEW_ULANG",
    slaStatus: "merah",
    slaDueDate: "06 Des 2025"
  }
];

export const similarReports = [
  {
    id: "HR-2025-336-23915",
    similarity: 93,
    description: "Pekerja tidak menggunakan APD lengkap di area konstruksi",
    location: "BMO 2 - Area Dumping",
    daysAgo: 6
  },
  {
    id: "HR-2025-336-23916",
    similarity: 93,
    description: "APD tidak digunakan dengan benar di lokasi kerja",
    location: "BMO 2 - Area Dumping",
    daysAgo: 6
  }
];

export const dashboardStats = {
  // AI Pipeline stats
  menungguAnalisisAI: 230,
  sedangDiprosesAI: 45,
  aiGagal: 3,
  batchSisaHariIni: 2,
  
  // Evaluator stats
  totalLaporan: 4127,
  siapDievaluasi: 3241,
  dalamEvaluasi: 156,
  selesai: 680,
  perluReviewUlang: 50,
  
  // Cluster stats
  painPoints: 4,
  totalCluster: 5,
  clusteredReport: 28,
  averageClusterSize: 5.6,
  criticalCluster: 3,
  
  // Performance
  reviewToClosing: 2.6,
  intervalSubmission: 20.4
};