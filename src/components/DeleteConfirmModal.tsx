import React from 'react';
import { Box, Text } from 'ink';

interface Props {
  branches: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ branches, onConfirm, onCancel }: Props) {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="red"
      padding={1}
      width={60}
    >
      <Text bold color="red">
        ⚠️  Confirm Deletion
      </Text>

      <Box marginTop={1} marginBottom={1} flexDirection="column">
        <Text>You are about to delete {branches.length} branch(es):</Text>
        <Box marginTop={1} flexDirection="column">
          {branches.map((branch) => (
            <Text key={branch} color="red">
              • {branch}
            </Text>
          ))}
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text bold color="green">
          [Y]
        </Text>
        <Text> Yes, delete </Text>
        <Text bold color="gray">
          [N]
        </Text>
        <Text> Cancel</Text>
      </Box>
    </Box>
  );
}
