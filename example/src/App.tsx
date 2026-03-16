import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FastBase64 from 'react-native-fast-base64';

type TestResult = {
  name: string;
  output: string;
  ok: boolean;
  error?: string;
};

function run(name: string, fn: () => string, expected?: string): TestResult {
  try {
    const output = fn();
    return {
      name,
      output,
      ok: expected === undefined ? true : output === expected,
    };
  } catch (e: any) {
    console.error(e);

    return { name, output: '', ok: false, error: String(e) };
  }
}

export default function App() {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const PLAIN = 'Hello, World!';
    const ENCODED = 'SGVsbG8sIFdvcmxkIQ==';
    const URL_ENCODED = 'SGVsbG8sIFdvcmxkIQ'; // base64url, no padding

    const strToBuffer = (str: string): ArrayBuffer => {
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
      return arr.buffer;
    };

    const bufferToStr = (buf: ArrayBuffer): string =>
      String.fromCharCode(...new Uint8Array(buf));

    const bytes = strToBuffer(PLAIN);

    const tests: TestResult[] = [
      // btoa / atob
      run('btoa', () => FastBase64.btoa(PLAIN), ENCODED),
      run('atob', () => FastBase64.atob(ENCODED), PLAIN),
      run(
        'atob ∘ btoa roundtrip',
        () => FastBase64.atob(FastBase64.btoa(PLAIN)),
        PLAIN
      ),

      // toBase64 / fromBase64
      run('toBase64', () => FastBase64.toBase64(bytes) as string, ENCODED),
      run(
        'fromBase64 → string',
        () => {
          const buf = FastBase64.fromBase64(ENCODED) as ArrayBuffer;
          return bufferToStr(buf);
        },
        PLAIN
      ),
      run(
        'fromBase64 ∘ toBase64 roundtrip',
        () => {
          const b64 = FastBase64.toBase64(bytes) as string;
          const buf = FastBase64.fromBase64(b64) as ArrayBuffer;
          return bufferToStr(buf);
        },
        PLAIN
      ),

      // toBase64URL / fromBase64URL
      run(
        'toBase64URL',
        () => FastBase64.toBase64URL(bytes) as string,
        URL_ENCODED
      ),
      run(
        'fromBase64URL → string',
        () => {
          const buf = FastBase64.fromBase64URL(URL_ENCODED) as ArrayBuffer;
          return bufferToStr(buf);
        },
        PLAIN
      ),
      run(
        'fromBase64URL ∘ toBase64URL roundtrip',
        () => {
          const b64url = FastBase64.toBase64URL(bytes) as string;
          const buf = FastBase64.fromBase64URL(b64url) as ArrayBuffer;
          return bufferToStr(buf);
        },
        PLAIN
      ),
    ];

    setResults(tests);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>FastBase64 – method tests</Text>
      {results.map((r, i) => (
        <View key={i} style={[styles.row, r.ok ? styles.pass : styles.fail]}>
          <Text style={styles.name}>
            {r.ok ? '✓' : '✗'} {r.name}
          </Text>
          {r.error ? (
            <Text style={styles.error}>{r.error}</Text>
          ) : (
            <Text style={styles.output}>{r.output}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#0d0d0d',
    minHeight: '100%',
  },
  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  pass: {
    backgroundColor: '#1a3a1a',
  },
  fail: {
    backgroundColor: '#3a1a1a',
  },
  name: {
    color: '#eee',
    fontWeight: '600',
    marginBottom: 4,
  },
  output: {
    color: '#aaa',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  error: {
    color: '#f88',
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
