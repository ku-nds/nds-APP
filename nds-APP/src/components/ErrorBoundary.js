import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>앱 오류가 발생했습니다</Text>
            <Text style={styles.errorMessage}>
              {this.state.error && this.state.error.toString()}
            </Text>
            {__DEV__ && this.state.errorInfo && (
              <ScrollView style={styles.errorDetails}>
                <Text style={styles.errorDetailsText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    maxWidth: '100%',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  errorDetails: {
    maxHeight: 200,
    marginTop: 10,
  },
  errorDetailsText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
});

export default ErrorBoundary;

