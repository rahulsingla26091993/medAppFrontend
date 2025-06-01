import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, Platform, View, Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { analyzeMedicalReport, MedicalReportAnalysis } from '@/services/api';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface FileUploadProps {
  onAnalysisComplete: (analysis: MedicalReportAnalysis) => void;
  onError: (error: string) => void;
}

export function FileUpload({ onAnalysisComplete, onError }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleUpload = async (fileResult: DocumentPicker.DocumentPickerResult) => {
    setError(null);
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      if (fileResult.canceled || !fileResult.assets || fileResult.assets.length === 0) {
        throw new Error('No file selected');
      }

      const file = fileResult.assets[0];
      console.log('Selected file:', {
        name: file.name,
        type: file.mimeType,
        size: file.size,
        uri: file.uri
      });

      // Create FormData
      const formData = new FormData();
      
      // Create a proper File or Blob object
      if (Platform.OS === 'web') {
        // For web, convert to Blob
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append('file', blob, file.name);
      } else {
        // For mobile platforms
        formData.append('file', {
          uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name
        } as any);
      }

      const analysis = await analyzeMedicalReport(formData);
      
      if (!analysis.success) {
        throw new Error(analysis.error || 'Failed to analyze medical report');
      }
      
      onAnalysisComplete(analysis);
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze medical report';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: false,
        copyToCacheDirectory: true
      });
      
      await handleUpload(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error selecting file';
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {error && (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          style={[
            styles.errorContainer,
            colorScheme === 'dark' && {
              backgroundColor: 'rgba(220, 53, 69, 0.15)',
              borderLeftColor: colors.error
            }
          ]}
        >
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <ThemedText style={[styles.errorText, { color: colors.error }]}>{error}</ThemedText>
        </Animated.View>
      )}
      
      {isLoading ? (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          style={[
            styles.loadingContainer,
            {
              backgroundColor: colors.backdrop
            }
          ]}
        >
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <ThemedText style={[styles.loadingText, { color: colors.primary }]}>
              {uploadProgress > 0 
                ? `Uploading... ${Math.round(uploadProgress)}%`
                : 'Analyzing medical report...'}
            </ThemedText>
          </View>
          <View style={[
            styles.progressBarContainer,
            {
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)'
            }
          ]}>
            <View 
              style={[
                styles.progressBar,
                { 
                  backgroundColor: colors.primary,
                  width: `${uploadProgress}%`
                }
              ]}
            />
          </View>
        </Animated.View>
      ) : (
        <TouchableOpacity 
          onPress={pickDocument}
          style={[
            styles.uploadButton,
            {
              backgroundColor: colorScheme === 'dark' ? colors.surfaceVariant : colors.primary,
              borderColor: colorScheme === 'dark' ? colors.primary : 'rgba(255,255,255,0.2)',
            },
            isLoading && styles.buttonDisabled
          ]}
          disabled={isLoading}
        >
          <View style={styles.buttonContent}>
            <Ionicons 
              name="cloud-upload-outline" 
              size={32} 
              color={colorScheme === 'dark' ? colors.primary : colors.surface}
            />
            <View style={styles.buttonTextContainer}>
              <ThemedText 
                style={[
                  styles.buttonText,
                  colorScheme === 'dark' 
                    ? { color: colors.text }
                    : { color: colors.surface }
                ]}
              >
                Select Medical Report
              </ThemedText>
              <ThemedText 
                style={[
                  styles.buttonSubtext,
                  colorScheme === 'dark' 
                    ? { color: colors.icon }
                    : { color: 'rgba(255,255,255,0.8)' }
                ]}
              >
                PDF, PNG, JPG up to 10MB
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  uploadButton: {
    borderRadius: 12,
    width: '100%',
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  buttonContent: {
    alignItems: 'center',
    gap: 12,
  },
  buttonTextContainer: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonSubtext: {
    fontSize: 14,
    marginTop: 4
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    width: '100%',
    borderLeftWidth: 4,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  loadingContainer: {
    width: '100%',
    minHeight: 120,
    borderRadius: 12,
    padding: 20,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBarContainer: {
    marginTop: 16,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '0%',
    borderRadius: 2,
  }
});
