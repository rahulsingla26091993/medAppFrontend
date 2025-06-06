const API_URL = 'https://medappbackend.onrender.com';

export interface MedicalReportAnalysis {
  success: boolean;
  analysis: string;
  originalText: string;
  error?: string;
}

export interface AnalyzeParams {
  file: File;
  problemDescription: string;
  hasMedicalHistory: boolean;
  previousDocuments?: File[];
}

export async function analyzeMedicalReport(params: AnalyzeParams): Promise<MedicalReportAnalysis> {
  console.log('Starting medical report analysis...');
  try {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('problem_description', params.problemDescription);
    formData.append('has_medical_history', params.hasMedicalHistory.toString());

    if (params.hasMedicalHistory && params.previousDocuments?.length) {
      params.previousDocuments.forEach((doc, index) => {
        formData.append('previous_documents', doc);
      });
    }

    console.log('FormData:', {
      filePresent: formData.has('file'),
      fileType: params.file instanceof File ? params.file.type : 'unknown',
      fileName: params.file.name,
      problemDescription: params.problemDescription,
      hasMedicalHistory: params.hasMedicalHistory,
      previousDocumentsCount: params.previousDocuments?.length || 0
    });

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = 'Failed to analyze medical report';
      
      try {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } else {
          errorMessage = await response.text() || errorMessage;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      
      throw new Error(errorMessage);
    }

    // Ensure we have JSON response
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    console.log('Analysis completed successfully');
    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error('Analysis failed:', error);
    return {
      success: false,
      analysis: '',
      originalText: '',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
