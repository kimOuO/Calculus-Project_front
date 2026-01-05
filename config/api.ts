// API Configuration
export const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  student: {
    create: '/Student_MetadataWriter/create',
    read: '/Student_MetadataWriter/read',
    update: '/Student_MetadataWriter/update',
    delete: '/Student_MetadataWriter/delete',
    status: '/Student_MetadataWriter/status',
    uploadExcel: '/Student_MetadataWriter/upload_excel',
    exportExcel: '/Student_MetadataWriter/feedback_excel',
  },
  score: {
    create: '/Score_MetadataWriter/create',
    read: '/Score_MetadataWriter/read',
    update: '/Score_MetadataWriter/update',
    delete: '/Score_MetadataWriter/delete',
    calculationFinal: '/Score_MetadataWriter/calculation_final',
    testScore: '/Score_MetadataWriter/test_score',
    stepDiagram: '/Score_MetadataWriter/step_diagram',
  },
  test: {
    create: '/Test_MetadataWriter/create',
    read: '/Test_MetadataWriter/read',
    update: '/Test_MetadataWriter/update',
    delete: '/Test_MetadataWriter/delete',
    status: '/Test_MetadataWriter/status',
    setWeight: '/Test_MetadataWriter/setweight',
  },
  file: {
    create: '/test-filedata/create',
    read: '/test-filedata/read',
    update: '/test-filedata/update',
    delete: '/test-filedata/delete',
  },
} as const;
