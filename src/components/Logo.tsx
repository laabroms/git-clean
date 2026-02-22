import React from 'react';
import { Box, Text } from 'ink';

export function Logo() {
  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      <Text bold color="cyan">
        ██████╗ ██╗████████╗       ██████╗██╗     ███████╗ █████╗ ███╗   ██╗
      </Text>
      <Text bold color="cyan">
        ██╔════╝ ██║╚══██╔══╝      ██╔════╝██║     ██╔════╝██╔══██╗████╗  ██║
      </Text>
      <Text bold color="blueBright">
        ██║  ███╗██║   ██║   █████╗██║     ██║     █████╗  ███████║██╔██╗ ██║
      </Text>
      <Text bold color="blueBright">
        ██║   ██║██║   ██║   ╚════╝██║     ██║     ██╔══╝  ██╔══██║██║╚██╗██║
      </Text>
      <Text bold color="magenta">
        ╚██████╔╝██║   ██║         ╚██████╗███████╗███████╗██║  ██║██║ ╚████║
      </Text>
      <Text bold color="magenta">
        ╚═════╝ ╚═╝   ╚═╝          ╚═════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
      </Text>
    </Box>
  );
}
