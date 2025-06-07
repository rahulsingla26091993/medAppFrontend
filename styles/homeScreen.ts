import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  wideContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerContent: {
    marginTop: Platform.OS === 'ios' ? 16 : 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 32 : 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
  featuresContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  featureCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    minWidth: Platform.OS === 'web' ? 300 : '100%',
    maxWidth: Platform.OS === 'web' ? 380 : undefined,
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
    borderRadius: 0,
    overflow: 'hidden',
    width: '100%',
    margin: 0,
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
  }
});
