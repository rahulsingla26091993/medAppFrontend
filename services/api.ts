import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const API_URL = 'https://medappbackend.onrender.com';

export interface MedicalReportAnalysis {
  success: boolean;
  analysis: string;
  originalText: string;
  error?: string;
}

export interface AnalyzeParams {
  file: DocumentPicker.DocumentPickerAsset;
  problemDescription: string;
  hasMedicalHistory: boolean;
  previousDocuments?: DocumentPicker.DocumentPickerAsset[];
}

export async function analyzeMedicalReport(params: AnalyzeParams): Promise<MedicalReportAnalysis> {
  console.log('Starting medical report analysis...');
  try {
    const formData = new FormData();

    // Main file handling
    if (params.file) {
      if (Platform.OS === 'web') {
        // For web, fetch the file as blob
        const response = await fetch(params.file.uri);
        const blob = await response.blob();
        formData.append('file', blob, params.file.name);
      } else {
        // For mobile platforms
        const fileInfo = await FileSystem.getInfoAsync(params.file.uri);
        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }

        const fileBlob = {
          uri: params.file.uri,
          type: params.file.mimeType || 'application/octet-stream',
          name: params.file.name
        };
        formData.append('file', fileBlob as any);
      }
    }

    formData.append('problem_description', params.problemDescription);
    formData.append('has_medical_history', params.hasMedicalHistory.toString());

    // Previous documents handling
    if (params.hasMedicalHistory && params.previousDocuments?.length) {
      for (const doc of params.previousDocuments) {
        if (Platform.OS === 'web') {
          const response = await fetch(doc.uri);
          const blob = await response.blob();
          formData.append('previous_documents', blob, doc.name);
        } else {
          const fileInfo = await FileSystem.getInfoAsync(doc.uri);
          if (!fileInfo.exists) {
            throw new Error(`Previous document ${doc.name} does not exist`);
          }

          const fileBlob = {
            uri: doc.uri,
            type: doc.mimeType || 'application/octet-stream',
            name: doc.name
          };
          formData.append('previous_documents', fileBlob as any);
        }
      }
    }

    console.log('FormData:', {
      filePresent: formData.has('file'),
      fileName: params.file.name,
      problemDescription: params.problemDescription,
      hasMedicalHistory: params.hasMedicalHistory,
      previousDocumentsCount: params.previousDocuments?.length || 0
    });

    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
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
