import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleX } from 'lucide-react-native';
import { globalStyles, colors } from '../styles/global';

interface Props {
  children: React.ReactNode;
}

interface State {
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorHeader}>
            <CircleX color="#991b1b" size={32} />
            <Text style={styles.errorTitle}>An error occurred</Text>
          </View>
          <Text selectable style={styles.errorText}>
            {String(this.state.error)}
          </Text>
        </View>
      );
    }
    return this.props.children as any;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fef2f2'
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#991b1b'
  },
  errorText: {
    fontSize: 14,
    color: '#991b1b',
    lineHeight: 20
  }
});