import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScrollView, View, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { MedicalReportAnalysis } from '@/services/api';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { styles } from '@/styles/reportAnalysis';

interface AnalysisContextType {
  analysis: MedicalReportAnalysis | null;
  error: string | null;
  setAnalysis: (analysis: MedicalReportAnalysis | null) => void;
  setError: (error: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysis, setAnalysis] = useState<MedicalReportAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis, error, setError }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

interface ReportAnalysisProps {
  analysis: MedicalReportAnalysis;
  isLoading?: boolean;
}

export function ReportAnalysis({ analysis, isLoading }: ReportAnalysisProps) {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { setAnalysis } = useAnalysis();

  React.useEffect(() => {
    setAnalysis(analysis);
  }, [analysis, setAnalysis]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={[styles.loadingText, { color: colors.primary }]}>
          Processing medical report...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!analysis.success || !analysis.analysis) {
    return (
      <ThemedView style={[
        styles.errorContainer,
        { 
          backgroundColor: colorScheme === 'dark' ? colors.surfaceVariant : colors.surface,
          borderWidth: 1,
          borderColor: colors.error + '40'
        }
      ]}>
        <View style={styles.errorHeader}>
          <Ionicons name="alert-circle" size={24} color={colors.error} />
          <ThemedText style={[styles.errorTitle, { color: colors.error }]}>
            Analysis Failed
          </ThemedText>
        </View>
        <ThemedText style={[styles.errorText, { color: colors.text + 'CC' }]}>
          {analysis.error || 'Failed to analyze the medical report. Please try again.'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderColor: colors.border
        },
        isWideScreen ? styles.wideContainer : { borderRadius: 0, margin: 0, width: '100%' }
      ]}
    >
      <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="document-text-outline" size={24} color={colors.primary} />
          <ThemedText style={[styles.headerTitle, { color: colors.text }]}>
            Analysis Results
          </ThemedText>
        </View>
      </ThemedView>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}>
        <ThemedView style={styles.content}>
          <ThemedView style={[
            styles.analysisContainer,
            { 
              backgroundColor: colorScheme === 'dark' ? colors.surfaceVariant : colors.surface,
              borderWidth: 1,
              borderColor: colors.border
            }
          ]}>
            <ThemedText style={[
              styles.analysisText, 
              { 
                color: colors.text,
                lineHeight: Platform.OS === 'ios' ? 24 : 22 
              }
            ]}>
              {analysis.analysis}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </Animated.View>
  );
}
