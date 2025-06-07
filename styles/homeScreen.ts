import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  wideContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerContent: {
    marginTop: Platform.OS === 'ios' ? 20 : 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 36 : 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 28,
  },
  featuresContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
    minWidth: Platform.OS === 'web' ? 320 : '100%',
    maxWidth: Platform.OS === 'web' ? 400 : undefined,
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
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
    gap: 8,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.8,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  uploadSection: {
    marginBottom: 40,
    paddingHorizontal: 20,
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
    lineHeight: 20,
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
