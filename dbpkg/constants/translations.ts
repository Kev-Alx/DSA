// src/constants/translations.ts
export const navLabels = {
  en: {
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    contact: "Contact",
  },
  id: {
    experience: "Pengalaman",
    education: "Pendidikan",
    projects: "Proyek",
    contact: "Kontak",
  },
};

export const translations = {
  en: {
    contact: {
      heading: "Get in touch",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    experience: {
      heading: "Experience",
      bcaRole: "Data Engineer Intern",
      bcaCompany: "PT Bank Central Asia Tbk.",
      bcaDesc1:
        "Built real-time data pipelines using Apache Kafka and Python to handle high-throughput data streams.",
      bcaDesc2:
        "Developed, Integrated, Tested and Deployed AI driven data processing pipeline service using FastAPI and Azure that converts unstructured data to structured data for legality requirements and better storage efficiency.",
      petraRole: "Data Team Member",
      petraCompany: "Tim Petra Sinergi, Petra Christian University",
      petraDesc1:
        "Designed and analyzed survey data for university events and programs, translating participant feedback into actionable insights to support evaluation and future planning.",
      petraDesc2:
        "Managed and queried organizational data using Excel and SQL while contributing to the maintenance and development of new features for the Tim Petra Sinergi website.",
      skills: "Skills",
    },
    education: {
      heading: "Education",
      coreCoursework: "Core Coursework",
      classOf: "Class of",
      history: [
        {
          university: "Petra Christian University",
          degree: "Bachelor of Computer Science",
          gradYear: "2026",
          gpa: "3.77 / 4.00",
          coursework: [
            "Data Analytics",
            "Data Visualization & Communication",
            "Statistics & Probability",
            "Machine Learning & Data Mining",
            "Relational Databases & SQL",
            "Software Engineering",
            "Cloud Computing & DevOps",
          ],
        },
        {
          university:
            "Royal Melbourne Institute of Technology (RMIT University)",
          degree: "Project Management Concepts Summer School Program",
          gradYear: "2021",
          gpa: "",
          coursework: [
            "Project Lifecycle & Planning",
            "Risk Management & Mitigation",
            "Stakeholder Engagement",
            "Project Scheduling & Budgeting",
            "Resource & Team Management",
          ],
        },
      ],
    },
    hero: {
      greeting:
        "Hi, I'm Kevin. I specialize in turning raw data into insights and models with a focus on visualization and storytelling.",
      breakdown: "Skill Breakdown //",
      disclosure:
        "* Note: These percentages don't reflect anything, it is purely for UI storytelling layout purposes and do not convey strict absolute boundaries or computational limits. I just it would be cool.",
      roles: {
        scientist: {
          label: "Data Scientist",
          summary:
            "Training and fine-tuning LLMs and ML models and developing end-to-end predictive solutions.",
          metrics: [
            "Predictive Modeling",
            "NLP & Tokenization",
            "Statistical Inference",
            "Cleaning Bad Data",
          ],
        },
        analyst: {
          label: "Analyst",
          summary:
            "Analysing millions of rows of data to identify patterns, trends, and anomalies that support data-driven decision-making",
          metrics: [
            "Econometrics & Forecasting",
            "Revenue & Basket Analysis",
            "Interactive Dashboards",
            "Translating Data for Execs",
          ],
        },
        engineer: {
          label: "&& Engineer",
          summary:
            "Architecting modern full-stack analytics pipelines and reliable cloud infrastructure.",
          metrics: [
            "ETL & Data Pipelines",
            "API & Service Design",
            "Cloud Infra (AWS)",
            "Debugging the Undebugable",
          ],
        },
      },
    },
    projects: {
      featuredHeading: "Featured Projects",
      analyticsHeading: "Analytics Projects",
      webDevHeading: "Web Dev Projects",
      filterAll: "All",
      filterAnalytics: "Analytics",
      filterWebDev: "Web Dev",
      repository: "Repository",
      liveDemo: "Live Demo",
      viewDetails: "View Details",
      collapse: "Collapse Projects",
      showMore: "Show More Projects",
      items: [
        {
          id: "electronic-store-ecommerce",
          title: "Electronic Store eCommerce Purchase History Analysis",
          type: "Data Analytics",
          featured: true,
          description:
            "An end-to-end e-commerce analytics project analyzing 2.1M+ transaction rows from an Open CDP dataset. Investigates revenue concentration, seasonal purchase patterns, customer retention cycles, and basket value dynamics to optimize marketing spend and product configurations.",
          tech: ["Python", "Pandas", "Tableau", "EDA", "Data Visualization"],
        },
        {
          id: "accommodation-customer-preference",
          title:
            "Accommodation Customer Preference & Revisit Intention Analysis",
          type: "Data Analytics, ML, NLP",
          featured: true,
          description:
            "An advanced text analytics and machine learning workflow that transforms over 200,000 unstructured Agoda and Airbnb customer reviews into actionable insights. Utilizes a fine-tuned ModernBERT model, Structural Topic Modeling (STM), and SHAP explainable AI to segment traveler priorities and predict repeat booking behavior.",
          tech: [
            "Python",
            "ModernBERT",
            "Structural Topic Modeling",
            "SHAP",
            "NLP",
          ],
        },
        {
          id: "global-trade-war-macro-analysis",
          title:
            "Global Trade War: Multi-Asset Macroeconomic & Financial Impact Analysis",
          type: "Economic Analysis",
          featured: true,
          description:
            "An econometric and financial research pipeline analyzing the multi-asset impact of global trade tensions from 2018 to 2026. Implements Cumulative Average Abnormal Return (CAAR) event studies, GARCH(1,1) currency volatility modeling, Difference-in-Differences (DiD) causal inference, and Vector Autoregression (VAR) for macroeconomic response tracking.",
          tech: [
            "Python",
            "Time-Series (GARCH/VAR)",
            "Event Studies",
            "Causal Inference",
            "OLS",
            "Anomaly Detection",
          ],
        },
        {
          id: "utils-or-tools",
          title: "Web Utilities Platform",
          type: "Full-Stack Web Development",
          featured: false,
          description:
            "A centralized, intuitive web application featuring a suite of essential utilities and daily productivity tools like PDF merger, image background remover, and more. Designed for maximum accessibility and speed directly from the browser.",
          tech: ["React", "Next.js", "Tailwind CSS", "Vercel"],
        },
        {
          id: "index-campus-event",
          title: "INDEX - Campus Event & Exhibition Platform",
          type: "Frontend Web Development",
          featured: false,
          description:
            "A refined event management platform developed for Petra Christian University to manage, showcase, and schedule campus-wide exhibitions, competitions, seminars, and workshops. Features an elegant editorial UI with integrated timeline tracking and user registration flows.",
          tech: ["Laravel", "Tailwind CSS", "MySQL", "cPanel"],
        },
        {
          id: "cloud-chart-bi-tool",
          title: "Simple Chart - Web-Based Business Intelligence Tool",
          type: "Full-Stack Web Development",
          featured: true,
          description:
            "A web-based, Tableau-like interactive data visualization and business intelligence tool. Enables users to upload datasets, dynamically drag and drop field variables into X/Y configurations, aggregate data granularly, and render highly customized interactive charts natively in the browser.",
          tech: ["Next.js", "React", "Python", "AWS"],
        },
      ],
    },
  },
  id: {
    contact: {
      heading: "Hubungi saya",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    experience: {
      heading: "Pengalaman",
      bcaRole: "Magang Data Engineer",
      bcaCompany: "PT Bank Central Asia Tbk.",
      bcaDesc1:
        "Membangun data pipeline real-time menggunakan Apache Kafka dan Python untuk menangani aliran data dengan throughput tinggi.",
      bcaDesc2:
        "Mengembangkan, mengintegrasikan, menguji, dan meluncurkan layanan pipeline pemrosesan data berbasis AI menggunakan FastAPI dan Azure yang mengubah data tidak terstruktur menjadi terstruktur demi kebutuhan legalitas dan efisiensi penyimpanan yang lebih baik.",
      petraRole: "Anggota Tim Data",
      petraCompany: "Tim Petra Sinergi, Universitas Kristen Petra",
      petraDesc1:
        "Merancang dan menganalisis data survei untuk acara dan program universitas, menerjemahkan umpan balik peserta menjadi wawasan yang dapat ditindaklanjuti guna mendukung evaluasi serta perencanaan di masa mendatang.",
      petraDesc2:
        "Mengelola dan melakukan query data organisasi menggunakan Excel dan SQL sembari berkontribusi dalam pemeliharaan dan pengembangan fitur baru untuk situs web Tim Petra Sinergi.",
      skills: "Keahlian",
    },
    education: {
      heading: "Pendidikan",
      coreCoursework: "Mata Kuliah Inti",
      classOf: "Angkatan",
      history: [
        {
          university: "Universitas Kristen Petra",
          degree: "Sarjana Komputer",
          gradYear: "2026",
          gpa: "3.77 / 4.00",
          coursework: [
            "Analisis Data",
            "Visualisasi & Komunikasi Data",
            "Statistik & Probabilitas",
            "Pembelajaran Mesin & Penambangan Data",
            "Basis Data Relasional & SQL",
            "Rekayasa Perangkat Lunak",
            "Komputasi Awan & DevOps",
          ],
        },
        {
          university:
            "Royal Melbourne Institute of Technology (Universitas RMIT)",
          degree: "Program Summer School Konsep Manajemen Proyek",
          gradYear: "2021",
          gpa: "",
          coursework: [
            "Siklus Hidup & Perencanaan Proyek",
            "Manajemen & Mitigasi Risiko",
            "Keterlibatan Pemangku Kepentingan",
            "Penjadwalan & Penganggaran Proyek",
            "Manajemen Sumber Daya & Tim",
          ],
        },
      ],
    },
    hero: {
      greeting:
        "Halo, saya Kevin. Saya berspesialisasi dalam mengubah data mentah menjadi wawasan dan model dengan fokus pada visualisasi dan penceritaan data.",
      breakdown: "Rincian Keahlian //",
      disclosure:
        "* Catatan: Persentase ini tidak mencerminkan apa pun secara riil, ini murni untuk kebutuhan tata letak cerita visual pada UI dan tidak menunjukkan batasan absolut yang ketat atau limit komputasi.",
      roles: {
        scientist: {
          label: "Data Scientist",
          summary:
            "Melatih dan melakukan fine-tuning pada LLM serta model ML, dan mengembangkan solusi prediktif ujung-ke-ujung (end-to-end).",
          metrics: [
            "Pemodelan Prediktif",
            "NLP & Tokenisasi",
            "Inferensi Statistik",
            "Membersihkan Data Rusak",
          ],
        },
        analyst: {
          label: "Analis",
          summary:
            "Menganalisis jutaan baris data untuk mengidentifikasi pola, tren, dan anomali yang mendukung pengambilan keputusan berbasis data.",
          metrics: [
            "Ekonometrika & Peramalan",
            "Analisis Pendapatan & Keranjang",
            "Dasbor Interaktif",
            "Menerjemahkan Data untuk Eksekutif",
          ],
        },
        engineer: {
          label: "&& Engineer",
          summary:
            "Merancang arsitektur pipeline analitik full-stack modern dan infrastruktur cloud yang andal.",
          metrics: [
            "ETL & Pipeline Data",
            "Desain API & Layanan",
            "Infrastruktur Cloud (AWS)",
            "Men-debug Hal yang Mustahil",
          ],
        },
      },
    },
    projects: {
      featuredHeading: "Proyek",
      analyticsHeading: "Proyek Analitik",
      webDevHeading: "Proyek Web",
      filterAll: "Semua",
      filterAnalytics: "Analitik",
      filterWebDev: "Pengembangan Web",
      repository: "Repositori",
      liveDemo: "Live Demo",
      viewDetails: "Lihat Detail",
      collapse: "Sembunyikan Proyek",
      showMore: "Tampilkan Lebih Banyak Proyek",
      items: [
        {
          id: "electronic-store-ecommerce",
          title: "Analisis Riwayat Pembelian eCommerce Toko Elektronik",
          type: "Data Analytics",
          featured: true,
          description:
            "Proyek analitik e-commerce end-to-end yang menganalisis lebih dari 2,1 juta baris transaksi dari dataset Open CDP. Meneliti konsentrasi pendapatan, pola pembelian musiman, siklus retensi pelanggan, dan dinamika nilai keranjang belanja untuk mengoptimalkan pengeluaran pemasaran dan konfigurasi produk.",
          tech: ["Python", "Pandas", "Tableau", "EDA", "Data Visualization"],
        },
        {
          id: "accommodation-customer-preference",
          title:
            "Analisis Preferensi Pelanggan & Niat Berkunjung Kembali pada Akomodasi",
          type: "Data Analytics, ML, NLP",
          featured: true,
          description:
            "Alur kerja analitik teks tingkat lanjut dan pembelajaran mesin yang mengubah lebih dari 200.000 ulasan pelanggan Agoda dan Airbnb yang tidak terstruktur menjadi wawasan berharga. Menggunakan model ModernBERT yang telah di-fine-tune, Structural Topic Modeling (STM), dan SHAP explainable AI untuk memetakan prioritas wisatawan serta memprediksi perilaku pemesanan ulang.",
          tech: [
            "Python",
            "ModernBERT",
            "Structural Topic Modeling",
            "SHAP",
            "NLP",
          ],
        },
        {
          id: "global-trade-war-macro-analysis",
          title:
            "Perang Dagang Global: Analisis Dampak Keuangan & Makroekonomi Multi-Aset",
          type: "Economic Analysis",
          featured: true,
          description:
            "Pipeline riset ekonometrika dan keuangan yang menganalisis dampak multi-aset dari ketegangan perdagangan global dari tahun 2018 hingga 2026. Menerapkan studi peristiwa Cumulative Average Abnormal Return (CAAR), pemodelan volatilitas mata uang GARCH(1,1) inferensi kausal Difference-in-Differences (DiD), serta Vector Autoregression (VAR) untuk pelacakan respons makroekonomi.",
          tech: [
            "Python",
            "Time-Series (GARCH/VAR)",
            "Event Studies",
            "Causal Inference",
            "OLS",
            "Anomaly Detection",
          ],
        },
        {
          id: "utils-or-tools",
          title: "Platform Utilitas Web",
          type: "Full-Stack Web Development",
          featured: false,
          description:
            "Aplikasi web terpusat dan intuitif yang menyediakan serangkaian utilitas penting dan alat produktivitas harian seperti penggabung PDF, penghapus latar belakang gambar, dan banyak lagi. Dirancang untuk aksesibilitas maksimal dan kecepatan langsung dari peramban.",
          tech: ["React", "Next.js", "Tailwind CSS", "Vercel"],
        },
        {
          id: "index-campus-event",
          title: "INDEX - Platform Pameran & Acara Kampus",
          type: "Frontend Web Development",
          featured: false,
          description:
            "Platform manajemen acara canggih yang dikembangkan untuk Universitas Kristen Petra untuk mengelola, menampilkan, dan menjadwalkan pameran, kompetisi, seminar, dan lokakarya di seluruh kampus. Menampilkan UI editorial yang elegan dengan pelacakan lini masa terintegrasi dan alur pendaftaran pengguna.",
          tech: ["Laravel", "Tailwind CSS", "MySQL", "cPanel"],
        },
        {
          id: "cloud-chart-bi-tool",
          title: "Simple Chart - Alat Intelijen Bisnis Berbasis Web",
          type: "Full-Stack Web Development",
          featured: true,
          description:
            "Alat visualisasi data interaktif dan intelijen bisnis berbasis web yang menyerupai Tableau. Memungkinkan pengguna mengunggah dataset, menyeret dan melepas variabel bidang ke dalam konfigurasi X/Y secara dinamis, mengagregasi data secara granular, serta merender grafik interaktif yang sangat disesuaikan secara asli di peramban.",
          tech: ["Next.js", "React", "Python", "AWS"],
        },
      ],
    },
  },
};
