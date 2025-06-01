import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FileUpload } from '@/components/FileUpload';
import { ReportAnalysis } from '@/components/ReportAnalysis';
import type { MedicalReportAnalysis } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const [analysis, setAnalysis] = useState<MedicalReportAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: colors.primaryLight,
        dark: colors.primaryDark
      }}
      headerImage={
        <LinearGradient
          colors={[colors.primary + '80', colors.primaryLight + '40']}
          style={StyleSheet.absoluteFillObject}>
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={[styles.headerImage, { opacity: colorScheme === 'dark' ? 0.4 : 0.6 }]}
            contentFit="contain"
          />
        </LinearGradient>
      }>
      <ThemedView style={[styles.container, isWideScreen && styles.wideContainer]}>
        <ThemedView style={styles.headerContent}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText style={[styles.title, { color: colors.primary }]}>
              Medical Report Analyzer
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
              Instant medical report analysis powered by AI
            </ThemedText>
          </ThemedView>

          <ThemedView style={[
            styles.featuresContainer,
            isWideScreen && styles.featuresGrid
          ]}>
            <Feature
              iconName="medical-outline"
              title="Medical Report Analysis"
              description="Upload medical reports in PDF or image format"
              accentColor={colors.primary}
            />
            <Feature
              iconName="push-outline"
              title="Instant Results"
              description="Get AI-powered analysis in seconds"
              accentColor={colors.primary}
            />
            <Feature
              iconName="document-text-outline"
              title="Comprehensive Summary"
              description="Key findings, diagnosis, and recommendations"
              accentColor={colors.primary}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={[
          styles.uploadSection,
          isWideScreen && styles.uploadSectionWide
        ]}>
          <FileUpload
            onAnalysisComplete={setAnalysis}
            onError={setError}
            style={styles.fileUpload}
          />

          {error && (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {analysis && (
          <ThemedView style={styles.analysisContainer}>
            <ReportAnalysis analysis={analysis} />
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

interface FeatureProps {
  iconName: string;
  title: string;
  description: string;
  accentColor: string;
}

function Feature({ iconName, title, description, accentColor }: FeatureProps) {
  return (
    <ThemedView style={styles.featureCard}>
      <LinearGradient
        colors={[accentColor + '10', accentColor + '05']}
        style={styles.featureGradient}>
        <ThemedView style={[styles.featureIcon, { backgroundColor: accentColor }]}>
          <Ionicons name={iconName as any} size={24} color="#fff" />
        </ThemedView>
        <ThemedView style={styles.featureTextContainer}>
          <ThemedText style={[styles.featureTitle, { color: accentColor }]}>{title}</ThemedText>
          <ThemedText style={styles.featureDescription}>{description}</ThemedText>
        </ThemedView>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  wideContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerContent: {
    marginTop: 32,
    marginBottom: 40,
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  featureCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
    minWidth: 300,
    maxWidth: 380,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featureGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 22,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  uploadSection: {
    marginBottom: 40,
  },
  uploadSectionWide: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  fileUpload: {
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    fontSize: 15,
  },
  analysisContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
