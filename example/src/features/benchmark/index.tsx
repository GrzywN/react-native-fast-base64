import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fmtOps, fmtMs, fmtX, type Group } from './helpers';
import { runAllBenchmarks } from './groups';

export function GroupView({ group }: { group: Group }) {
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupLabel}>{group.label}</Text>
        <Text style={styles.groupDesc}>{group.desc}</Text>
      </View>
      {group.rows.map((row) => (
        <View key={row.label} style={styles.sizeBlock}>
          <Text style={styles.sizeLabel}>{row.label}</Text>
          {row.runs.map((run) => (
            <View key={run.lib} style={styles.runRow}>
              <Text style={styles.libName}>{run.lib}</Text>
              <View style={styles.runMetrics}>
                <Text style={[styles.opsVal, run.fastest && styles.fastest]}>
                  {run.fastest ? '★ ' : ''}
                  {fmtOps(run.ops)}
                </Text>
                <Text style={styles.metaSub}>
                  {fmtMs(run.ms)} · {fmtX(run.x)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export function BenchmarkSection() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [running, setRunning] = useState(false);

  const runBench = useCallback(() => {
    setRunning(true);
    setGroups([]);
    setTimeout(() => {
      setGroups(runAllBenchmarks());
      setRunning(false);
    }, 50);
  }, []);

  return (
    <>
      <Text style={styles.section}>Benchmark</Text>
      <Pressable
        style={[styles.btn, running && styles.btnOff]}
        onPress={runBench}
        disabled={running}
      >
        <Text style={styles.btnText}>
          {running ? 'Running…' : groups.length ? 'Re-run' : 'Run'}
        </Text>
      </Pressable>
      {groups.map((group) => (
        <GroupView key={group.id} group={group} />
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
  },
  btn: {
    backgroundColor: '#1e3a5f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  btnOff: { opacity: 0.5 },
  btnText: { color: '#7eb8f7', fontWeight: '600', fontSize: 14 },
  group: {
    backgroundColor: '#141414',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 6,
  },
  groupLabel: {
    color: '#eee',
    fontWeight: '700',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  groupDesc: { color: '#555', fontSize: 11 },
  sizeBlock: { marginTop: 6 },
  sizeLabel: {
    color: '#555',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  runRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 3,
  },
  libName: { color: '#777', fontFamily: 'monospace', fontSize: 12, flex: 1 },
  runMetrics: { alignItems: 'flex-end' },
  opsVal: { color: '#aaa', fontFamily: 'monospace', fontSize: 12 },
  metaSub: {
    color: '#555',
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 1,
  },
  fastest: { color: '#7fff7f', fontWeight: '700' },
});
