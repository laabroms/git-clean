import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { Logo } from './components/Logo.js';
import { BranchList } from './components/BranchList.js';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.js';
import { getBranches, deleteBranch, isGitRepo, type Branch } from './git.js';

type View = 'list' | 'confirm' | 'deleting' | 'complete';

export function App() {
  const { exit } = useApp();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set());
  const [view, setView] = useState<View>('list');
  const [deleteResults, setDeleteResults] = useState<{ success: string[]; failed: string[] }>({
    success: [],
    failed: [],
  });

  // Load branches on mount
  useEffect(() => {
    if (!isGitRepo()) {
      console.log('❌ Not a Git repository');
      exit();
      return;
    }

    try {
      const branchData = getBranches();
      setBranches(branchData);
    } catch (error) {
      console.log('❌ Failed to load branches:', error);
      exit();
    }
  }, [exit]);

  // Keyboard controls
  useInput((input, key) => {
    if (view === 'list') {
      // Navigation
      if (key.upArrow) {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (key.downArrow) {
        setSelectedIndex((prev) => Math.min(branches.length - 1, prev + 1));
      }
      // Mark/unmark for deletion
      else if (input === ' ') {
        const branch = branches[selectedIndex];
        if (!branch.protected) {
          setMarkedForDeletion((prev) => {
            const next = new Set(prev);
            if (next.has(branch.name)) {
              next.delete(branch.name);
            } else {
              next.add(branch.name);
            }
            return next;
          });
        }
      }
      // Quick delete
      else if (input === 'd' || key.delete) {
        if (markedForDeletion.size > 0) {
          setView('confirm');
        }
      }
      // Auto-mark merged branches
      else if (input === 'm') {
        const mergedBranches = branches.filter((b) => b.merged && !b.protected);
        setMarkedForDeletion(new Set(mergedBranches.map((b) => b.name)));
      }
      // Auto-mark stale branches (>90 days)
      else if (input === 's') {
        const staleBranches = branches.filter((b) => b.daysStale > 90 && !b.protected);
        setMarkedForDeletion(new Set(staleBranches.map((b) => b.name)));
      }
      // Clear selection
      else if (input === 'c') {
        setMarkedForDeletion(new Set());
      }
      // Quit
      else if (input === 'q' || (key.escape && markedForDeletion.size === 0)) {
        exit();
      }
    } else if (view === 'confirm') {
      if (input === 'y' || input === 'Y') {
        setView('deleting');
        performDeletion();
      } else if (input === 'n' || input === 'N' || key.escape) {
        setView('list');
      }
    } else if (view === 'complete') {
      exit();
    }
  });

  const performDeletion = () => {
    const success: string[] = [];
    const failed: string[] = [];

    for (const branchName of markedForDeletion) {
      const branch = branches.find((b) => b.name === branchName);
      if (branch) {
        const force = !branch.merged;
        const deleted = deleteBranch(branchName, force);
        if (deleted) {
          success.push(branchName);
        } else {
          failed.push(branchName);
        }
      }
    }

    setDeleteResults({ success, failed });
    setView('complete');
  };

  if (view === 'list') {
    return (
      <Box flexDirection="column">
        <Logo />
        <BranchList
          branches={branches}
          selectedIndex={selectedIndex}
          markedForDeletion={markedForDeletion}
        />
        <Box marginTop={1} flexDirection="column">
          <Text color="cyan">Quick Actions:</Text>
          <Text color="gray">
            [m] Mark all merged  [s] Mark stale (90d+)  [c] Clear  [q] Quit
          </Text>
        </Box>
      </Box>
    );
  }

  if (view === 'confirm') {
    return (
      <Box flexDirection="column">
        <Logo />
        <DeleteConfirmModal
          branches={Array.from(markedForDeletion)}
          onConfirm={() => {
            setView('deleting');
            performDeletion();
          }}
          onCancel={() => setView('list')}
        />
      </Box>
    );
  }

  if (view === 'deleting') {
    return (
      <Box flexDirection="column">
        <Logo />
        <Text color="yellow">Deleting branches...</Text>
      </Box>
    );
  }

  if (view === 'complete') {
    return (
      <Box flexDirection="column">
        <Logo />
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="green">
            ✓ Deletion Complete
          </Text>

          {deleteResults.success.length > 0 && (
            <Box flexDirection="column" marginTop={1}>
              <Text color="green">Successfully deleted ({deleteResults.success.length}):</Text>
              {deleteResults.success.map((branch) => (
                <Text key={branch} color="green">
                  • {branch}
                </Text>
              ))}
            </Box>
          )}

          {deleteResults.failed.length > 0 && (
            <Box flexDirection="column" marginTop={1}>
              <Text color="red">Failed to delete ({deleteResults.failed.length}):</Text>
              {deleteResults.failed.map((branch) => (
                <Text key={branch} color="red">
                  • {branch}
                </Text>
              ))}
            </Box>
          )}

          <Box marginTop={1}>
            <Text color="gray">Press any key to exit...</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
}
