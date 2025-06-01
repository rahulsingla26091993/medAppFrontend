import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useAnalysis } from '@/components/ReportAnalysis';

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
  const { analysis } = useAnalysis();
  const [recommendations, setRecommendations] = useState<DoctorRecommendation[]>([]);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // In a real app, you would fetch recommendations from your backend
  useEffect(() => {
    if (analysis && analysis.analysis) {
      // Extract specialist recommendations from the analysis text
      const specialistRegex = /- Specialist Type: (.*)\n\s*Reason: (.*)/g;
      const extractedRecommendations: DoctorRecommendation[] = [];
      let match;
      while ((match = specialistRegex.exec(analysis.analysis)) !== null) {
        extractedRecommendations.push({
          specialty: match[1].trim(),
          reason: match[2].trim(),
          description: '', // Description is not available in the current analysis format
          icon: 'medical-outline', // Use a default icon
        });
      }
      setRecommendations(extractedRecommendations);
    } else {
      setRecommendations([]);
    }
  }, [analysis]);

  return (
    <ThemedView style={styles.container}>
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
            No specialist recommendations available yet. Please analyze a medical report first.
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  recommendationsContainer: {
    gap: 16,
  },
  recommendationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  specialty: {
    fontSize: 18,
    fontWeight: '600',
  },
  reason: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
