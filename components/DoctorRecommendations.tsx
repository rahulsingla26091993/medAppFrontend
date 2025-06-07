import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useAnalysis } from '@/components/ReportAnalysis';
import { styles } from '@/styles/doctorRecommendations';

interface DoctorRecommendation {
  specialty: string;
  reason: string;
  description: string;
  icon: string;
}

// This would ideally come from your backend API based on the report analysis
const mockRecommendations: DoctorRecommendation[] = [
  {
    specialty: 'Cardiologist',
    reason: 'Heart-related symptoms and history',
    description: 'A cardiologist can evaluate your heart health, monitor blood pressure, and provide specialized cardiac care.',
    icon: 'heart-outline',
  },
  {
    specialty: 'Endocrinologist',
    reason: 'Diabetes management',
    description: 'An endocrinologist specializes in hormonal conditions and can help manage diabetes and related complications.',
    icon: 'fitness-outline',
  },
  {
    specialty: 'Neurologist',
    reason: 'Headaches and dizziness',
    description: 'A neurologist can evaluate your neurological symptoms and provide appropriate treatment.',
    icon: 'brain-outline',
  }
];

export default function DoctorRecommendationsScreen() {
  const [recommendations, setRecommendations] = useState<DoctorRecommendation[]>([]);
  const { analysis } = useAnalysis();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    if (analysis?.success) {
      // Here you would extract the recommendations from the analysis
      // For now, we'll use the mock data
      const extractedRecommendations = mockRecommendations;
      setRecommendations(extractedRecommendations);
    } else {
      setRecommendations([]);
    }
  }, [analysis]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ThemedView style={styles.header}>
          <ThemedText style={[styles.title, { color: colors.primary }]}>
            Recommended Specialists
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
            Based on your medical report analysis, you may want to consult these specialists
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.recommendationsContainer}>
          {recommendations.length > 0 ? (
            recommendations.map((recommendation, index) => (
              <ThemedView
                key={index}
                style={[
                  styles.recommendationCard,
                  { backgroundColor: colors.surface }
                ]}
              >
                <ThemedView style={[
                  styles.iconContainer,
                  { backgroundColor: colorScheme === 'dark' ? colors.backdrop : colors.surfaceVariant }
                ]}>
                  <Ionicons
                    name={recommendation.icon as any}
                    size={32}
                    color={colors.primary}
                  />
                </ThemedView>
                <ThemedView style={styles.cardContent}>
                  <ThemedText style={[styles.specialty, { color: colors.text }]}>
                    {recommendation.specialty}
                  </ThemedText>
                  <ThemedText style={[styles.reason, { color: colors.primary }]}>
                    {recommendation.reason}
                  </ThemedText>
                  <ThemedText style={[styles.description, { color: colors.icon }]}>
                    {recommendation.description}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ))
          ) : (
            <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
              No specialist recommendations available. Please upload a medical report for analysis.
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
