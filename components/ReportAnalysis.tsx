import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { MedicalReportAnalysis } from '@/services/api';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface AnalysisContextType {
  analysis: MedicalReportAnalysis | null;
  setAnalysis: (analysis: MedicalReportAnalysis | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysis, setAnalysis] = useState<MedicalReportAnalysis | null>(null);

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
    margin: 0,
    width: '100%',
  },
  wideContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    margin: 0,
    borderRadius: Platform.OS === 'web' ? 16 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 16 : 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerTitle: {
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: Platform.OS === 'ios' ? 16 : 14,
    gap: 16,
  },
  analysisContainer: {
    padding: Platform.OS === 'ios' ? 16 : 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  analysisText: {
    fontSize: Platform.OS === 'ios' ? 16 : 15,
    lineHeight: Platform.OS === 'ios' ? 24 : 22,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'ios' ? 40 : 32,
    gap: 16,
  },
  loadingText: {
    fontSize: Platform.OS === 'ios' ? 16 : 15,
  },
  errorContainer: {
    padding: Platform.OS === 'ios' ? 24 : 20,
    borderRadius: 12,
    gap: 12,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorTitle: {
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: Platform.OS === 'ios' ? 16 : 15,
    lineHeight: Platform.OS === 'ios' ? 24 : 22,
  },
});

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
      <ThemedView style={styles.loadingContainer}>
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
        { backgroundColor: colorScheme === 'dark' ? colors.surfaceVariant : colors.surface }
      ]}>
        <View style={styles.errorHeader}>
          <Ionicons name="alert-circle" size={24} color={colors.error} />
          <ThemedText style={[styles.errorTitle, { color: colors.error }]}>
            Analysis Failed
          </ThemedText>
        </View>
        <ThemedText style={styles.errorText}>
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
        },
        isWideScreen ? styles.wideContainer : { borderRadius: 0, margin: 0, width: '100%' }
      ]}
    >
      <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
        <Ionicons name="document-text-outline" size={24} color={colors.primary} />
        <ThemedText style={[styles.headerTitle, { color: colors.primary }]}>
          Analysis Results
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedView style={[
            styles.analysisContainer,
            { backgroundColor: colorScheme === 'dark' ? colors.surfaceVariant : colors.surface }
          ]}>
            <ThemedText style={[styles.analysisText, { color: colors.text }]}>
              {analysis.analysis}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </Animated.View>
  );
}
