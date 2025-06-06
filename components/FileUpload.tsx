import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, Platform, View, TextInput } from 'react-native';
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
  style?: any;
}

export function FileUpload({ onAnalysisComplete, onError, style }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [problemDescription, setProblemDescription] = useState('');
  const [hasMedicalHistory, setHasMedicalHistory] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [previousDocuments, setPreviousDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a medical report file');
      onError('Please select a medical report file');
      return;
    }

    if (!problemDescription.trim()) {
      setError('Please describe your medical concern');
      onError('Please describe your medical concern');
      return;
    }

    setError(null);
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      // Create FormData
      const formData = new FormData();
      
      // Add main file
      if (Platform.OS === 'web') {
        // For web, convert to Blob
        const response = await fetch(selectedFile.uri);
        const blob = await response.blob();
        formData.append('file', blob, selectedFile.name);
      } else {
        // For mobile platforms
        formData.append('file', {
          uri: Platform.OS === 'ios' ? selectedFile.uri.replace('file://', '') : selectedFile.uri,
          type: selectedFile.mimeType || 'application/octet-stream',
          name: selectedFile.name
        } as any);
      }

      // Add problem description and medical history flag
      formData.append('problem_description', problemDescription);
      formData.append('has_medical_history', hasMedicalHistory.toString());

      // Add previous documents if any
      if (hasMedicalHistory && previousDocuments.length > 0) {
        for (const doc of previousDocuments) {
          if (Platform.OS === 'web') {
            const response = await fetch(doc.uri);
            const blob = await response.blob();
            formData.append('previous_documents', blob, doc.name);
          } else {
            formData.append('previous_documents', {
              uri: Platform.OS === 'ios' ? doc.uri.replace('file://', '') : doc.uri,
              type: doc.mimeType || 'application/octet-stream',
              name: doc.name
            } as any);
          }
        }
      }

      const analysis = await analyzeMedicalReport({
        file: selectedFile as any,
        problemDescription,
        hasMedicalHistory,
        previousDocuments: previousDocuments as any[]
      });
      
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

  const pickDocument = async (forHistory: boolean = false) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: forHistory,
        copyToCacheDirectory: true
      });
      
      if (!result.canceled) {
        if (forHistory) {
          setPreviousDocuments(result.assets);
        } else {
          setSelectedFile(result.assets[0]);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error selecting file';
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <ThemedView style={[styles.container, style]}>
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
      
      <ThemedView style={styles.form}>
        {/* Problem Description Input */}
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Describe your medical concern:</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { 
                color: colors.text,
                backgroundColor: colorScheme === 'dark' ? colors.surfaceVariant : colors.surface,
                borderColor: colors.border
              }
            ]}
            value={problemDescription}
            onChangeText={setProblemDescription}
            placeholder="E.g., Experiencing frequent headaches and dizziness"
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Medical History Toggle */}
        <TouchableOpacity 
          style={styles.historyToggle}
          onPress={() => setHasMedicalHistory(!hasMedicalHistory)}
        >
          <View style={[
            styles.checkbox,
            {
              borderColor: colors.primary,
              backgroundColor: hasMedicalHistory ? colors.primary : 'transparent'
            }
          ]}>
            {hasMedicalHistory && (
              <Ionicons name="checkmark" size={16} color={colors.surface} />
            )}
          </View>
          <ThemedText>I have relevant medical history documents</ThemedText>
        </TouchableOpacity>

        {/* Previous Documents Uploader */}
        {hasMedicalHistory && (
          <View style={styles.historyDocuments}>
            <TouchableOpacity 
              onPress={() => pickDocument(true)}
              style={[
                styles.historyUploadButton,
                {
                  backgroundColor: colorScheme === 'dark' ? colors.surfaceVariant : colors.surface,
                  borderColor: colors.border
                }
              ]}
            >
              <Ionicons 
                name="document-attach-outline" 
                size={24} 
                color={colors.primary}
              />
              <ThemedText style={styles.historyButtonText}>
                {previousDocuments.length > 0 
                  ? `${previousDocuments.length} document(s) selected`
                  : 'Add previous medical documents'}
              </ThemedText>
            </TouchableOpacity>
            {previousDocuments.length > 0 && (
              <View style={styles.selectedFiles}>
                {previousDocuments.map((doc, index) => (
                  <View key={index} style={styles.selectedFile}>
                    <Ionicons name="document-outline" size={16} color={colors.icon} />
                    <ThemedText style={styles.fileName}>{doc.name}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Main Document Upload Button */}
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
              styles.progressBar,
              {
                backgroundColor: colorScheme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)'
              }
            ]}>
              <View 
                style={[
                  styles.progressBarFill,
                  { 
                    backgroundColor: colors.primary,
                    width: `${uploadProgress}%`
                  }
                ]}
              />
            </View>
          </Animated.View>
        ) : (
          <>
            <TouchableOpacity 
              onPress={() => pickDocument(false)}
              style={[
                styles.uploadButton,
                {
                  backgroundColor: colorScheme === 'dark' ? colors.surfaceVariant : colors.primary,
                  borderColor: colorScheme === 'dark' ? colors.primary : 'rgba(255,255,255,0.2)',
                }
              ]}
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
                    {selectedFile ? 'Change Medical Report' : 'Select Medical Report'}
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

            {selectedFile && (
              <View style={styles.selectedMainFile}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                <ThemedText style={[styles.selectedFileName, { color: colors.text }]}>
                  {selectedFile.name}
                </ThemedText>
              </View>
            )}

            {/* Analyze Button */}
            {selectedFile && (
              <TouchableOpacity 
                style={[
                  styles.analyzeButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: !problemDescription.trim() ? 0.5 : 1
                  }
                ]}
                onPress={handleUpload}
                disabled={!problemDescription.trim()}
              >
                <ThemedText style={[styles.analyzeButtonText, { color: colors.surface }]}>
                  Analyze Report
                </ThemedText>
              </TouchableOpacity>
            )}
          </>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({  container: {
    alignItems: 'center',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    alignSelf: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 0 : 20,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '500',
    color: Platform.OS === 'ios' ? undefined : '#666',
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 15,
    minHeight: 80,
  },
  historyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDocuments: {
    width: '100%',
    gap: 12,
  },
  historyUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  historyButtonText: {
    fontSize: 16,
  },
  selectedFiles: {
    gap: 8,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileName: {
    fontSize: 14,
  },  uploadButton: {
    borderRadius: 12,
    width: '100%',
    minHeight: Platform.OS === 'web' ? 120 : 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'web' ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: Platform.OS === 'ios' ? 2 : 1,
    borderStyle: 'dashed',
  },
  buttonContent: {
    alignItems: 'center',
    gap: Platform.OS === 'web' ? 12 : 8,
  },
  buttonTextContainer: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  selectedMainFile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  selectedFileName: {
    fontSize: 16,
  },
  analyzeButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: '600',
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
  progressBar: {
    marginTop: 16,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '0%',
    borderRadius: 2,
  }
});
