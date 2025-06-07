import { Image } from 'expo-image';
import { Platform, useWindowDimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FileUpload } from '@/components/FileUpload';
import { ReportAnalysis } from '@/components/ReportAnalysis';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { styles as homeStyles } from '@/styles/homeScreen';
import { useAnalysis } from '@/components/ReportAnalysis';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { analysis, error } = useAnalysis();

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
            style={[homeStyles.headerImage, { opacity: colorScheme === 'dark' ? 0.4 : 0.6 }]}
            contentFit="contain"
          />
        </LinearGradient>
      }>
      <ThemedView style={[homeStyles.container, isWideScreen && homeStyles.wideContainer]}>
        <ThemedView style={homeStyles.headerContent}>
          <ThemedView style={homeStyles.titleContainer}>
            <ThemedText style={[homeStyles.title, { color: colors.primary }]}>
              Medical Report Analyzer
            </ThemedText>
            <ThemedText style={[homeStyles.subtitle, { color: colors.icon }]}>
              Instant medical report analysis powered by AI
            </ThemedText>
          </ThemedView>

          <ThemedView style={[
            homeStyles.featuresContainer,
            isWideScreen && homeStyles.featuresGrid
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
          homeStyles.uploadSection,
          isWideScreen && homeStyles.uploadSectionWide
        ]}>
          <FileUpload style={homeStyles.fileUpload} />

          {error && (
            <ThemedView style={homeStyles.errorContainer}>
              <ThemedText style={homeStyles.errorText}>{error}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {analysis && (
          <ThemedView style={homeStyles.analysisContainer}>
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
    <ThemedView style={homeStyles.featureCard}>
      <LinearGradient
        colors={[accentColor + '10', accentColor + '05']}
        style={homeStyles.featureGradient}>
        <ThemedView style={[homeStyles.featureIcon, { backgroundColor: accentColor }]}>
          <Ionicons name={iconName as any} size={24} color="#fff" />
        </ThemedView>
        <ThemedView style={homeStyles.featureTextContainer}>
          <ThemedText style={[homeStyles.featureTitle, { color: accentColor }]}>{title}</ThemedText>
          <ThemedText style={homeStyles.featureDescription}>{description}</ThemedText>
        </ThemedView>
      </LinearGradient>
    </ThemedView>
  );
}
