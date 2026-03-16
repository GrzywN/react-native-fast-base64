import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TestResult } from '../../shared';
import { run as runCppV8 } from './cpp-v8';
import { run as runBase64JS } from './base64-js';
import { run as runTc39 } from './tc39';

function runAllTests(): TestResult[] {
  return [...runCppV8(), ...runBase64JS(), ...runTc39()];
}

export function TestRow({ result }: { result: TestResult }) {
  return (
    <View
      testID={`test-${result.id}`}
      style={[styles.testRow, result.ok ? styles.pass : styles.fail]}
    >
      <Text style={styles.testStatus}>{result.ok ? 'PASS' : 'FAIL'}</Text>
      <Text style={styles.testName}>{result.name}</Text>
      {result.detail ? (
        <Text style={styles.testDetail}>{result.detail}</Text>
      ) : null}
    </View>
  );
}

export function TestsSection() {
  const [tests, setTests] = useState<TestResult[]>([]);

  const handleRun = useCallback(() => {
    setTests(runAllTests());
  }, []);

  const tested = tests.length > 0;
  const passed = tests.filter((result) => result.ok).length;

  return (
    <>
      <Text style={styles.section}>Tests</Text>
      <Pressable style={styles.btn} onPress={handleRun}>
        <Text style={styles.btnText}>
          {tested ? `Re-run (${passed}/${tests.length})` : 'Run'}
        </Text>
      </Pressable>
      {tested && (
        <Text testID="summary" style={styles.summary}>
          {passed} / {tests.length} passed
        </Text>
      )}
      {tests.map((result) => (
        <TestRow key={result.id} result={result} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 28,
  },
  btn: {
    backgroundColor: '#1e3a5f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  btnText: { color: '#7eb8f7', fontWeight: '600', fontSize: 14 },
  summary: {
    color: '#7fff7f',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 10,
  },
  testRow: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
  },
  pass: { backgroundColor: '#0f2410' },
  fail: { backgroundColor: '#2e1010' },
  testStatus: {
    color: '#555',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  testName: {
    color: '#ccc',
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 2,
  },
  testDetail: {
    color: '#f88',
    fontFamily: 'monospace',
    fontSize: 11,
    marginTop: 4,
  },
});
