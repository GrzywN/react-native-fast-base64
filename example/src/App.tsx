import { ScrollView, StyleSheet, Text } from 'react-native';
import { BenchmarkSection } from './features/benchmark';
import { TestsSection } from './features/tests';

export interface AppProps {
  title?: string;
}

export default function App({ title = 'react-native-fast-base64' }: AppProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <BenchmarkSection />
      <TestsSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#0d0d0d',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 20 },
});
