export interface APIResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface MedicalReportData {
  analysis: string;
  originalText: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  message?: string;
}
