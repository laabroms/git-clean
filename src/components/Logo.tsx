import React from 'react';
import { Box, Text } from 'ink';

export function Logo() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="red">
        ╔═══════════════════════════╗
      </Text>
      <Text bold color="red">
        ║   </Text><Text bold color="white">🧹 GIT-CLEAN</Text><Text bold color="red">         ║
      </Text>
      <Text bold color="red">
        ║  </Text><Text color="gray">Clean up old branches</Text><Text bold color="red">  ║
      </Text>
      <Text bold color="red">
        ╚═══════════════════════════╝
      </Text>
    </Box>
  );
}
