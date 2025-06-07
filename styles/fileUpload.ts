import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
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
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyButtonText: {
    fontSize: 15,
  },
  selectedFiles: {
    width: '100%',
    gap: 8,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  fileName: {
    fontSize: 15,
  },
  uploadButton: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
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
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
});
