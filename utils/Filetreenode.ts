// utils/fileTree.ts
import { FileTreeItem } from "@/types/github";
import { Issue } from "@/types/analysis";


export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  extension?: string;
  children?: FileTreeNode[];
  // Analysis annotations (added after analysis)
  status?: 'clean' | 'warning' | 'critical' | 'none';
  annotation?: string; // e.g. "1,243 lines - too large"
}

/**
 * Converts flat GitHub file tree into nested tree structure
 * for the report's Directory Architecture section
 */
export function buildFileTree(flatTree: FileTreeItem[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const map: Record<string, FileTreeNode> = {};

  // Sort so folders come before files
  const sorted = [...flatTree].sort((a, b) => {
    if (a.type === 'tree' && b.type === 'blob') return -1;
    if (a.type === 'blob' && b.type === 'tree') return 1;
    return a.path.localeCompare(b.path);
  });

  sorted.forEach((item) => {
    const parts = item.path.split('/');
    const name = parts[parts.length - 1];
    const extension = name.includes('.') ? name.split('.').pop() : undefined;

    const node: FileTreeNode = {
      name,
      path: item.path,
      type: item.type === 'tree' ? 'folder' : 'file',
      size: item.size,
      extension,
      children: item.type === 'tree' ? [] : undefined,
    };

    map[item.path] = node;

    if (parts.length === 1) {
      // Root level
      root.push(node);
    } else {
      // Find parent
      const parentPath = parts.slice(0, -1).join('/');
      const parent = map[parentPath];
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  });

  return root;
}

/**
 * After analysis runs, annotate the tree with findings
 * so the report can highlight problem files
 */
export function annotateFileTree(
  tree: FileTreeNode[],
  issues: Issue[]
): FileTreeNode[] {
  const issuesByFile: Record<string, Issue[]> = {};

  issues.forEach((issue) => {
    if (issue.file) {
      if (!issuesByFile[issue.file]) issuesByFile[issue.file] = [];
      issuesByFile[issue.file].push(issue);
    }
  });

  function annotate(nodes: FileTreeNode[]): FileTreeNode[] {
    return nodes.map((node) => {
      const fileIssues = issuesByFile[node.path] || [];
      const hasCritical = fileIssues.some((i) => i.severity === 'critical');
      const hasHigh = fileIssues.some((i) => i.severity === 'high');

      let status: FileTreeNode['status'] = 'none';
      let annotation = '';

      if (hasCritical) {
        status = 'critical';
        annotation = `${fileIssues.length} critical issue(s)`;
      } else if (hasHigh) {
        status = 'warning';
        annotation = `${fileIssues.length} issue(s)`;
      }

      // Also flag large files
      if (node.size && node.size > 50000 && status === 'none') {
        status = 'warning';
        annotation = `${Math.round(node.size / 1000)}KB — large file`;
      }

      return {
        ...node,
        status,
        annotation,
        children: node.children ? annotate(node.children) : undefined,
      };
    });
  }

  return annotate(tree);
}