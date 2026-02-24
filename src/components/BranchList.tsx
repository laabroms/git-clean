import React from 'react';
import { Box, Text } from 'ink';
import type { Branch } from '../git.js';

interface Props {
  branches: Branch[];
  selectedIndex: number;
  markedForDeletion: Set<string>;
  staleDays: number;
}

export function BranchList({ branches, selectedIndex, markedForDeletion, staleDays }: Props) {
  const termRows = process.stdout.rows || 24;
  // Reserve space for: logo (8) + header (2) + footer status (1) + quick actions (3) + status msg (1) + padding
  const windowSize = Math.max(5, termRows - 16);

  const half = Math.floor(windowSize / 2);
  let start = Math.max(0, selectedIndex - half);
  const end = Math.min(branches.length, start + windowSize);
  if (end - start < windowSize) {
    start = Math.max(0, end - windowSize);
  }
  const visible = branches.slice(start, end);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Branches ({branches.length})
        </Text>
        <Text color="gray"> — Use ↑/↓ to navigate, Space to mark, d to delete</Text>
      </Box>

      {start > 0 && (
        <Text dimColor>  ↑ {start} more</Text>
      )}

      {visible.map((branch, i) => {
        const actualIndex = start + i;
        const isSelected = actualIndex === selectedIndex;
        const isMarked = markedForDeletion.has(branch.name);

        let statusColor: string = 'gray';
        let statusText = '';

        if (branch.current && branch.protected) {
          statusColor = 'green';
          statusText = '● CURRENT 🔒';
        } else if (branch.current) {
          statusColor = 'green';
          statusText = '● CURRENT';
        } else if (branch.protected) {
          statusColor = 'yellow';
          statusText = '🔒 PROTECTED';
        } else if (branch.merged) {
          statusColor = 'blue';
          statusText = '✓ MERGED';
        } else if (branch.daysStale > staleDays * 2) {
          statusColor = 'red';
          statusText = `⚠ ${branch.daysStale}d stale`;
        } else if (branch.daysStale > staleDays) {
          statusColor = 'yellow';
          statusText = `${branch.daysStale}d stale`;
        } else {
          statusText = `${branch.daysStale}d ago`;
        }

        return (
          <Box key={branch.name}>
            <Text color={isSelected ? 'cyan' : 'white'}>
              {isSelected ? '▶ ' : '  '}
            </Text>
            {branch.protected ? (
              <Text>   </Text>
            ) : (
              <Text color={isMarked ? 'red' : 'white'}>
                {isMarked ? '☑ ' : '☐ '}
              </Text>
            )}
            <Box width={30}>
              <Text bold={isSelected} color={isMarked ? 'red' : 'white'}>
                {branch.name}
              </Text>
            </Box>
            <Text color={statusColor}>{statusText}</Text>
          </Box>
        );
      })}

      {end < branches.length && (
        <Text dimColor>  ↓ {branches.length - end} more</Text>
      )}

      <Box marginTop={1}>
        <Text color="gray">
          {markedForDeletion.size > 0
            ? `${markedForDeletion.size} branch(es) marked for deletion`
            : 'No branches marked'}
        </Text>
      </Box>
    </Box>
  );
}
