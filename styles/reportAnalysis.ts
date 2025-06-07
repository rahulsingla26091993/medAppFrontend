import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
