const API_URL = 'https://medappbackend.onrender.com';

export interface MedicalReportAnalysis {
  success: boolean;
  analysis: string;
  originalText: string;
  error?: string;
}

export async function analyzeMedicalReport(formData: FormData): Promise<MedicalReportAnalysis> {
  console.log('Starting medical report analysis...');
  try {
    // Log the form data for debugging
    const file = formData.get('file') as File | null;
    console.log('FormData:', {
      filePresent: formData.has('file'),
      fileType: file instanceof File ? file.type : 'unknown',
      fileName: file instanceof File ? file.name : 'unknown'
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
