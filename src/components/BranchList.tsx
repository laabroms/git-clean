import React from 'react';
import { Box, Text } from 'ink';
import type { Branch } from '../git.js';

interface Props {
  branches: Branch[];
  selectedIndex: number;
  markedForDeletion: Set<string>;
}

export function BranchList({ branches, selectedIndex, markedForDeletion }: Props) {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Branches ({branches.length})
        </Text>
        <Text color="gray"> — Use ↑/↓ to navigate, Space to mark, d to delete</Text>
      </Box>

      {branches.map((branch, index) => {
        const isSelected = index === selectedIndex;
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
        } else if (branch.daysStale > 90) {
          statusColor = 'red';
          statusText = `⚠ ${branch.daysStale}d stale`;
        } else if (branch.daysStale > 30) {
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
            <Text color={isMarked ? 'red' : 'white'}>
              {isMarked ? '☑ ' : '☐ '}
            </Text>
            <Box width={30}>
              <Text bold={isSelected} color={isMarked ? 'red' : 'white'}>
                {branch.name}
              </Text>
            </Box>
            <Text color={statusColor}>{statusText}</Text>
          </Box>
        );
      })}

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
