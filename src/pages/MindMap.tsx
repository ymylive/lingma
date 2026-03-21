import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  Download,
  FileUp,
  Link as LinkIcon,
  ListPlus,
  Maximize2,
  Minimize2,
  MoveDown,
  MoveUp,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronRight,
  Wand2
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { fetchDocumentFromUrl } from '../services/docService';
import {
  expandMindMapNodeNote,
  generateMindMap,
  type MindMapData,
  type MindMapGenerateMode,
  type MindMapNode,
} from '../services/mindMapService';
import { isRemoteMindMapSyncEnabled, loadMindMapsFromServer, saveMindMapsToServer } from '../services/mindMapStoreService';

type SourceTab = 'topic' | 'url' | 'file';

interface SelectedNode {
  node: MindMapNode;
  parentId?: string;
  index?: number;
}

const STORAGE_PREFIX = 'ds_mindmaps_v1';
const MIN_SCALE = 0.35;
const MAX_SCALE = 2.4;

const createId = () =>
  `${Math.random().toString(36).slice(2, 6)}${Date.now().toString(36).slice(-4)}`;

const createNode = (title = '新节点'): MindMapNode => ({
  id: createId(),
  title,
  note: '',
  collapsed: false,
  children: [],
});

const buildPersonalContext = (progress: ReturnType<typeof useUser>['progress']) => {
  const categoryCount = progress.learningHistory.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return [
    `已完成课程：${progress.completedLessons.length} 节`,
    `已完成练习：${progress.completedExercises.length} 题`,
    `连续学习：${progress.streak} 天`,
    topCategories.length ? `近期关注：${topCategories.join('、')}` : '',
  ]
    .filter(Boolean)
    .join('\n');
};
const findNodeById = (nodes: MindMapNode[], id: string, parentId?: string): SelectedNode | null => {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.id === id) return { node, parentId, index: i };
    const child = findNodeById(node.children, id, node.id);
    if (child) return child;
  }
  return null;
};

const updateNodeById = (
  nodes: MindMapNode[],
  id: string,
  updater: (node: MindMapNode) => MindMapNode
): MindMapNode[] => {
  let changed = false;
  const next = nodes.map((node) => {
    if (node.id === id) {
      changed = true;
      return updater(node);
    }
    if (node.children.length) {
      const updatedChildren = updateNodeById(node.children, id, updater);
      if (updatedChildren !== node.children) {
        changed = true;
        return { ...node, children: updatedChildren };
      }
    }
    return node;
  });
  return changed ? next : nodes;
};

const addSiblingById = (nodes: MindMapNode[], id: string, sibling: MindMapNode): MindMapNode[] => {
  let changed = false;
  const next = nodes.flatMap((node) => {
    if (node.id === id) {
      changed = true;
      return [node, sibling];
    }
    if (node.children.length) {
      const updatedChildren = addSiblingById(node.children, id, sibling);
      if (updatedChildren !== node.children) {
        changed = true;
        return [{ ...node, children: updatedChildren }];
      }
    }
    return [node];
  });
  return changed ? next : nodes;
};

const deleteNodeById = (nodes: MindMapNode[], id: string): MindMapNode[] => {
  let changed = false;
  const next = nodes
    .filter((node) => {
      if (node.id === id) {
        changed = true;
        return false;
      }
      return true;
    })
    .map((node) => {
      if (node.children.length) {
        const updatedChildren = deleteNodeById(node.children, id);
        if (updatedChildren !== node.children) {
          changed = true;
          return { ...node, children: updatedChildren };
        }
      }
      return node;
    });
  return changed ? next : nodes;
};

const moveNodeById = (nodes: MindMapNode[], id: string, direction: 'up' | 'down'): MindMapNode[] => {
  const index = nodes.findIndex((node) => node.id === id);
  if (index !== -1) {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= nodes.length) return nodes;
    const clone = [...nodes];
    [clone[index], clone[target]] = [clone[target], clone[index]];
    return clone;
  }
  let changed = false;
  const next = nodes.map((node) => {
    if (node.children.length) {
      const updatedChildren = moveNodeById(node.children, id, direction);
      if (updatedChildren !== node.children) {
        changed = true;
        return { ...node, children: updatedChildren };
      }
    }
    return node;
  });
  return changed ? next : nodes;
};

const nodesToMarkdown = (nodes: MindMapNode[], depth = 0): string[] => {
  const lines: string[] = [];
  nodes.forEach((node) => {
    const prefix = '  '.repeat(depth);
    lines.push(`${prefix}- ${node.title}`);
    if (node.note) {
      lines.push(`${prefix}  > ${node.note}`);
    }
    if (node.children.length) {
      lines.push(...nodesToMarkdown(node.children, depth + 1));
    }
  });
  return lines;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const hashValue = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const clampScale = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

interface ExportLayoutNode {
  id: string;
  depth: number;
  titleLines: string[];
  noteLines: string[];
  width: number;
  height: number;
  x: number;
  y: number;
  subtreeHeight: number;
  children: ExportLayoutNode[];
}

const isWideCharacter = (char: string) => (char.codePointAt(0) ?? 0) > 0xff;

const measureTextUnits = (value: string) =>
  Array.from(value).reduce((sum, char) => sum + (isWideCharacter(char) ? 1.85 : 1), 0);

const wrapTextByUnits = (value: string, maxUnits: number, maxLines: number): string[] => {
  const chars = Array.from(value.trim());
  if (!chars.length) return [];
  const lines: string[] = [];
  let cursor = 0;

  while (cursor < chars.length && lines.length < maxLines) {
    let width = 0;
    let line = '';
    while (cursor < chars.length) {
      const char = chars[cursor];
      const units = isWideCharacter(char) ? 1.85 : 1;
      if (width + units > maxUnits && line) break;
      line += char;
      width += units;
      cursor += 1;
    }
    lines.push(line.trim() || line);
  }

  if (cursor < chars.length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/\s+$/g, '')}…`;
  }

  return lines.filter(Boolean);
};

const buildLayoutNode = (node: MindMapNode, depth: number): ExportLayoutNode => {
  const titleLines = wrapTextByUnits(node.title || '未命名', 14, 3);
  const noteLines = node.note ? wrapTextByUnits(node.note, 20, 3) : [];
  const maxUnits = Math.max(
    ...titleLines.map(measureTextUnits),
    ...(noteLines.length ? noteLines.map(measureTextUnits) : [0]),
    8
  );
  const width = Math.min(380, Math.max(170, Math.round(maxUnits * 9 + 44)));
  const titleHeight = titleLines.length * 18;
  const noteHeight = noteLines.length ? noteLines.length * 14 + 10 : 0;
  const height = Math.max(66, 16 + titleHeight + noteHeight + 16);

  return {
    id: node.id,
    depth,
    titleLines,
    noteLines,
    width,
    height,
    x: 0,
    y: 0,
    subtreeHeight: 0,
    children: node.children.map((child) => buildLayoutNode(child, depth + 1)),
  };
};

const computeSubtreeHeight = (node: ExportLayoutNode, verticalGap: number): number => {
  if (!node.children.length) {
    node.subtreeHeight = node.height;
    return node.subtreeHeight;
  }
  const childrenTotal = node.children.reduce((sum, child) => {
    return sum + computeSubtreeHeight(child, verticalGap);
  }, 0);
  const gapsTotal = verticalGap * Math.max(0, node.children.length - 1);
  node.subtreeHeight = Math.max(node.height, childrenTotal + gapsTotal);
  return node.subtreeHeight;
};

const assignLayoutPosition = (
  node: ExportLayoutNode,
  depth: number,
  top: number,
  levelGap: number,
  verticalGap: number
) => {
  node.x = depth * levelGap;
  node.y = top + (node.subtreeHeight - node.height) / 2;

  if (!node.children.length) return;

  const childrenTotalHeight =
    node.children.reduce((sum, child) => sum + child.subtreeHeight, 0) +
    verticalGap * Math.max(0, node.children.length - 1);
  let childTop = top + (node.subtreeHeight - childrenTotalHeight) / 2;

  node.children.forEach((child) => {
    assignLayoutPosition(child, depth + 1, childTop, levelGap, verticalGap);
    childTop += child.subtreeHeight + verticalGap;
  });
};

const collectLayoutItems = (
  node: ExportLayoutNode,
  nodes: ExportLayoutNode[],
  edges: Array<{ from: ExportLayoutNode; to: ExportLayoutNode }>
) => {
  nodes.push(node);
  node.children.forEach((child) => {
    edges.push({ from: node, to: child });
    collectLayoutItems(child, nodes, edges);
  });
};

const buildSvgExport = (map: MindMapData) => {
  const rootNode: MindMapNode = {
    id: `__mindmap_root__${map.id}`,
    title: map.title || '学习导图',
    note: map.source?.type ? `来源：${map.source.type.toUpperCase()}` : '',
    collapsed: false,
    children: map.nodes,
  };

  const layoutRoot = buildLayoutNode(rootNode, 0);
  const verticalGap = 28;
  const levelGap = 260;
  computeSubtreeHeight(layoutRoot, verticalGap);
  assignLayoutPosition(layoutRoot, 0, 0, levelGap, verticalGap);

  const nodes: ExportLayoutNode[] = [];
  const edges: Array<{ from: ExportLayoutNode; to: ExportLayoutNode }> = [];
  collectLayoutItems(layoutRoot, nodes, edges);

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  nodes.forEach((node) => {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
  });

  const padding = 56;
  const offsetX = padding - minX;
  const offsetY = padding - minY;
  const width = Math.max(760, Math.ceil(maxX - minX + padding * 2));
  const height = Math.max(460, Math.ceil(maxY - minY + padding * 2));

  const edgeMarkup = edges
    .map(({ from, to }) => {
      const startX = from.x + from.width + offsetX;
      const startY = from.y + from.height / 2 + offsetY;
      const endX = to.x + offsetX;
      const endY = to.y + to.height / 2 + offsetY;
      const distance = Math.max(60, endX - startX);
      const c1x = startX + distance * 0.45;
      const c2x = endX - distance * 0.35;
      return `<path d="M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`;
    })
    .join('');

  const nodeMarkup = nodes
    .map((node) => {
      const isRoot = node.id === layoutRoot.id;
      const x = node.x + offsetX;
      const y = node.y + offsetY;
      const fillColor = isRoot ? '#312e81' : '#ffffff';
      const strokeColor = isRoot ? '#4338ca' : '#cbd5e1';
      const titleColor = isRoot ? '#e0e7ff' : '#0f172a';
      const noteColor = isRoot ? '#c7d2fe' : '#64748b';
      const accent = isRoot ? '#8b5cf6' : '#818cf8';

      let textY = 30;
      const titleText = node.titleLines
        .map((line) => {
          const row = `<text x="${node.width / 2}" y="${textY}" text-anchor="middle" font-size="15" font-weight="600" fill="${titleColor}">${escapeXml(line)}</text>`;
          textY += 18;
          return row;
        })
        .join('');

      if (node.noteLines.length) {
        textY += 10;
      }
      const noteText = node.noteLines
        .map((line) => {
          const row = `<text x="${node.width / 2}" y="${textY}" text-anchor="middle" font-size="12" fill="${noteColor}">${escapeXml(line)}</text>`;
          textY += 14;
          return row;
        })
        .join('');

      return `
<g transform="translate(${x}, ${y})">
  <rect width="${node.width}" height="${node.height}" rx="16" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.6" filter="url(#mindmap-shadow)"/>
  <rect x="0" y="0" width="${node.width}" height="5" rx="16" fill="${accent}"/>
  ${titleText}
  ${noteText}
</g>`;
    })
    .join('');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="mindmap-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef2ff"/>
    </linearGradient>
    <filter id="mindmap-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#mindmap-bg)"/>
  ${edgeMarkup}
  ${nodeMarkup}
</svg>
  `.trim();
};

const downloadBlob = (name: string, blob: Blob) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};
export default function MindMap() {
  const { formatDate } = useI18n();
  const { theme } = useTheme();
  const { user, progress } = useUser();

  const userId = user?.id || '';
  const remoteSyncEnabled = Boolean(user) && isRemoteMindMapSyncEnabled();
  const storageKey = `${STORAGE_PREFIX}_${userId || 'guest'}`;
  const [maps, setMaps] = useState<MindMapData[]>([]);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [sourceTab, setSourceTab] = useState<SourceTab>('topic');
  const [topicInput, setTopicInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileText, setFileText] = useState('');
  const [generationMode, setGenerationMode] = useState<MindMapGenerateMode>('full');
  const [mapTitle, setMapTitle] = useState('');
  const [scale, setScale] = useState(1);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sourcePreview, setSourcePreview] = useState<{ title?: string; length?: number } | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [isRemoteReady, setIsRemoteReady] = useState(false);
  const [isNodeAiLoading, setIsNodeAiLoading] = useState(false);
  const [nodeAiError, setNodeAiError] = useState('');
  const [nodeAiWriteMode, setNodeAiWriteMode] = useState<'replace' | 'append'>('replace');
  const [isDragOver, setIsDragOver] = useState(false);

  const lastSyncedMapsRef = useRef('');
  const pendingAutoGenerateRef = useRef(false);
  const lastPersistedMapsRef = useRef('');
  const skipNextRemoteSyncRef = useRef(false);
  const mindMapPanelRef = useRef<HTMLDivElement | null>(null);
  const [pan, setPan] = useState({ x: 24, y: 24 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const isSpacePressedRef = useRef(false);
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 24, y: 24 });
  const panStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 24,
    originY: 24,
  });

  const containerClass =
    theme === 'dark'
      ? 'min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-slate-100'
      : 'min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900';

  useEffect(() => {
    let cancelled = false;

    const localMaps: MindMapData[] = (() => {
      const candidateKeys = userId ? [storageKey, `${STORAGE_PREFIX}_guest`] : [storageKey];

      const stored = candidateKeys
        .map((key) => localStorage.getItem(key))
        .find((value) => Boolean(value));

      if (!stored) return [];
      try {
        const parsed = JSON.parse(stored) as MindMapData[];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    setMaps(localMaps);
    setActiveMapId(localMaps[0]?.id || null);
    setSelectedNodeId(null);
    setSyncStatus('idle');
    setSyncMessage('');
    setIsRemoteReady(!remoteSyncEnabled);
    lastSyncedMapsRef.current = JSON.stringify(localMaps);
    lastPersistedMapsRef.current = lastSyncedMapsRef.current;
    skipNextRemoteSyncRef.current = true;

    if (!remoteSyncEnabled) {
      if (userId) {
        setSyncMessage('服务端同步未启用，当前仅本地保存');
      }
      return () => {
        cancelled = true;
      };
    }

    const loadFromServer = async () => {
      setSyncStatus('syncing');
      try {
        const remote = await loadMindMapsFromServer();
        if (cancelled) return;

        const remoteMaps = Array.isArray(remote.maps) ? remote.maps : [];

        if (remoteMaps.length) {
          setMaps(remoteMaps);
          setActiveMapId(remoteMaps[0]?.id || null);
          localStorage.setItem(storageKey, JSON.stringify(remoteMaps));
          lastSyncedMapsRef.current = JSON.stringify(remoteMaps);
          setSyncStatus('saved');
          setSyncMessage(`Loaded ${remoteMaps.length} maps from server`);
        } else {
          setSyncStatus('saved');
          setSyncMessage('No server maps yet; using local cache');
          if (localMaps.length) {
            await saveMindMapsToServer(localMaps);
            if (cancelled) return;
            setSyncMessage('Uploaded local maps to server');
            lastSyncedMapsRef.current = JSON.stringify(localMaps);
          }
        }
      } catch (err) {
        if (cancelled) return;
        setSyncStatus('error');
        setSyncMessage(
          err instanceof Error
            ? `Server sync failed, fallback to local cache: ${err.message}`
            : 'Server sync failed, fallback to local cache'
        );
      } finally {
        if (!cancelled) {
          setIsRemoteReady(true);
        }
      }
    };

    loadFromServer();

    return () => {
      cancelled = true;
    };
  }, [remoteSyncEnabled, storageKey, userId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const serialized = JSON.stringify(maps);
      if (serialized === lastPersistedMapsRef.current) {
        return;
      }
      localStorage.setItem(storageKey, serialized);
      lastPersistedMapsRef.current = serialized;
    }, 250);

    return () => window.clearTimeout(timer);
  }, [maps, storageKey]);

  useEffect(() => {
    if (!remoteSyncEnabled || !isRemoteReady) return;

    const timer = window.setTimeout(async () => {
      const serialized = JSON.stringify(maps);

      if (skipNextRemoteSyncRef.current) {
        skipNextRemoteSyncRef.current = false;
        lastSyncedMapsRef.current = serialized;
        return;
      }

      if (serialized === lastSyncedMapsRef.current) {
        return;
      }

      try {
        setSyncStatus('syncing');
        await saveMindMapsToServer(maps);
        lastSyncedMapsRef.current = serialized;
        setSyncStatus('saved');
        setSyncMessage(`Synced ${maps.length} maps to server`);
      } catch (err) {
        setSyncStatus('error');
        setSyncMessage(
          err instanceof Error ? `Auto sync failed: ${err.message}` : 'Auto sync failed, please retry later'
        );
      }
    }, 800);

    return () => window.clearTimeout(timer);
  }, [isRemoteReady, maps, remoteSyncEnabled]);

  useEffect(() => {
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
    };
    const handleFullscreenChange = () => {
      const currentFullscreen = document.fullscreenElement || doc.webkitFullscreenElement || null;
      setIsMapFullscreen(currentFullscreen === mindMapPanelRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange as EventListener);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange as EventListener);
    };
  }, []);

  const activeMap = useMemo(
    () => maps.find((map) => map.id === activeMapId) || null,
    [maps, activeMapId]
  );

  useEffect(() => {
    if (!activeMap && isMapFullscreen) {
      if (document.fullscreenElement && document.exitFullscreen) {
        void document.exitFullscreen();
      }
      setIsMapFullscreen(false);
    }
  }, [activeMap, isMapFullscreen]);

  const selectedNode = useMemo(() => {
    if (!activeMap || !selectedNodeId) return null;
    return findNodeById(activeMap.nodes, selectedNodeId);
  }, [activeMap, selectedNodeId]);

  useEffect(() => {
    setNodeAiError('');
  }, [selectedNodeId]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    setPan({ x: 24, y: 24 });
    setScale(1);
    panRef.current = { x: 24, y: 24 };
    scaleRef.current = 1;
  }, [activeMapId]);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return Boolean(target.closest('input,textarea,select,[contenteditable="true"]'));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat || isEditableTarget(event.target)) {
        return;
      }
      event.preventDefault();
      isSpacePressedRef.current = true;
      setIsSpacePressed(true);
    };

    const releaseSpace = () => {
      isSpacePressedRef.current = false;
      setIsSpacePressed(false);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      releaseSpace();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseSpace);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseSpace);
    };
  }, []);

  const balancedRootNodes = useMemo(() => {
    const left: MindMapNode[] = [];
    const right: MindMapNode[] = [];
    if (!activeMap) return { left, right };

    activeMap.nodes.forEach((node) => {
      const side = hashValue(`${activeMap.id}:${node.id}`) % 2 === 0 ? 'right' : 'left';
      if (side === 'right') {
        right.push(node);
      } else {
        left.push(node);
      }
    });

    if (activeMap.nodes.length > 1 && (!left.length || !right.length)) {
      left.length = 0;
      right.length = 0;
      activeMap.nodes.forEach((node, index) => {
        if (index % 2 === 0) {
          right.push(node);
        } else {
          left.push(node);
        }
      });
    }

    return { left, right };
  }, [activeMap]);
  const hasDualRootSides = balancedRootNodes.left.length > 0 && balancedRootNodes.right.length > 0;

  useEffect(() => {
    if (!activeMap) {
      setSelectedNodeId(null);
      setMapTitle('');
      return;
    }
    setMapTitle(activeMap.title);
    if (activeMap.nodes.length && !selectedNodeId) {
      setSelectedNodeId(activeMap.nodes[0].id);
    }
  }, [activeMap, selectedNodeId]);

  const updateActiveMap = useCallback(
    (updater: (map: MindMapData) => MindMapData) => {
      if (!activeMap) return;
      setMaps((prev) =>
        prev.map((map) => (map.id === activeMap.id ? updater(map) : map))
      );
    },
    [activeMap]
  );

  const handleCreateNew = () => {
    const now = new Date().toISOString();
    const newMap: MindMapData = {
      id: createId(),
      title: '未命名思维导图',
      source: { type: 'topic', value: '' },
      nodes: [createNode('核心主题')],
      createdAt: now,
      updatedAt: now,
    };
    setMaps((prev) => [newMap, ...prev]);
    setActiveMapId(newMap.id);
    setSelectedNodeId(newMap.nodes[0].id);
  };

  const handleDeleteMap = (mapId: string) => {
    setMaps((prev) => prev.filter((map) => map.id !== mapId));
    if (activeMapId === mapId) {
      setActiveMapId(null);
      setSelectedNodeId(null);
    }
  };

  const handleGenerate = async (mode: 'new' | 'update') => {
    setError('');
    setIsLoading(true);
    try {
      let sourceText = '';
      const sourceType: SourceTab = sourceTab;
      let sourceValue = '';
      let sourceTitle = '';

      if (sourceTab === 'topic') {
        sourceText = topicInput.trim();
        sourceValue = sourceText;
        sourceTitle = sourceText;
      } else if (sourceTab === 'url') {
        const url = urlInput.trim() || activeMap?.source.value || '';
        if (!url) throw new Error('请输入 URL');
        const fetched = await fetchDocumentFromUrl(url);
        sourceText = fetched.text;
        sourceValue = fetched.url;
        sourceTitle = fetched.title;
        setSourcePreview({ title: fetched.title, length: fetched.length });
      } else {
        if (!fileText.trim()) throw new Error('请先上传文本文件');
        sourceText = fileText;
        sourceValue = fileName || '上传文件';
        sourceTitle = fileName || '上传文件';
      }

      if (!sourceText.trim()) throw new Error('请输入有效内容');

      const personalContext = buildPersonalContext(progress);
      const result = await generateMindMap({
        title: mapTitle || sourceTitle || '学习主题',
        sourceType,
        sourceText,
        sourceTitle,
        personalContext,
        existingMap: mode === 'update' ? activeMap : null,
        generationMode,
      });

      const now = new Date().toISOString();
      const nextMap: MindMapData = {
        id: activeMap?.id || createId(),
        title: result.title || mapTitle || sourceTitle || '学习主题',
        source: { type: sourceType, value: sourceValue || sourceText, title: sourceTitle },
        nodes: result.nodes || [],
        createdAt: activeMap?.createdAt || now,
        updatedAt: now,
      };

      setMaps((prev) => {
        const exists = prev.some((map) => map.id === nextMap.id);
        if (exists) {
          return prev.map((map) => (map.id === nextMap.id ? nextMap : map));
        }
        return [nextMap, ...prev];
      });
      setActiveMapId(nextMap.id);
      setSelectedNodeId(nextMap.nodes[0]?.id || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFileText(String(reader.result || ''));
      setFileName(file.name);
      setSourcePreview({ title: file.name, length: String(reader.result || '').length });
    };
    reader.readAsText(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'md', 'markdown'].includes(ext || '')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setFileText(text);
      setFileName(file.name);
      setSourceTab('file');
      setSourcePreview({ title: file.name, length: text.length });
      pendingAutoGenerateRef.current = true;
    };
    reader.readAsText(file);
  }, []);

  useEffect(() => {
    if (pendingAutoGenerateRef.current && fileText) {
      pendingAutoGenerateRef.current = false;
      handleGenerate('new');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileText]);

  const handleUpdateTitle = (value: string) => {
    setMapTitle(value);
    updateActiveMap((map) => ({ ...map, title: value, updatedAt: new Date().toISOString() }));
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleAddChild = () => {
    if (!activeMap || !selectedNodeId) return;
    updateActiveMap((map) => ({
      ...map,
      nodes: updateNodeById(map.nodes, selectedNodeId, (node) => ({
        ...node,
        collapsed: false,
        children: [...node.children, createNode('新子节点')],
      })),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddSibling = () => {
    if (!activeMap || !selectedNodeId) return;
    updateActiveMap((map) => ({
      ...map,
      nodes: addSiblingById(map.nodes, selectedNodeId, createNode('新节点')),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleDeleteNode = () => {
    if (!activeMap || !selectedNodeId) return;
    updateActiveMap((map) => ({
      ...map,
      nodes: deleteNodeById(map.nodes, selectedNodeId),
      updatedAt: new Date().toISOString(),
    }));
    setSelectedNodeId(null);
  };

  const handleMoveNode = (direction: 'up' | 'down') => {
    if (!activeMap || !selectedNodeId) return;
    updateActiveMap((map) => ({
      ...map,
      nodes: moveNodeById(map.nodes, selectedNodeId, direction),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleToggleCollapse = (nodeId: string) => {
    if (!activeMap) return;
    updateActiveMap((map) => ({
      ...map,
      nodes: updateNodeById(map.nodes, nodeId, (node) => ({
        ...node,
        collapsed: !node.collapsed,
      })),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleExportJson = () => {
    if (!activeMap) return;
    const blob = new Blob([JSON.stringify(activeMap, null, 2)], { type: 'application/json' });
    downloadBlob(`${activeMap.title || 'mindmap'}.json`, blob);
  };

  const handleExportMarkdown = () => {
    if (!activeMap) return;
    const lines = [`# ${activeMap.title}`, ...nodesToMarkdown(activeMap.nodes)];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    downloadBlob(`${activeMap.title || 'mindmap'}.md`, blob);
  };

  const handleExportSvg = () => {
    if (!activeMap) return;
    const svg = buildSvgExport(activeMap);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    downloadBlob(`${activeMap.title || 'mindmap'}.svg`, blob);
  };

  const handleExportPng = async () => {
    if (!activeMap) return;
    const svg = buildSvgExport(activeMap);
    const img = new Image();
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    img.onload = () => {
      const dpr = 2;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * dpr;
      canvas.height = img.height * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        downloadBlob(`${activeMap.title || 'mindmap'}.png`, blob);
      }, 'image/png');
    };
    img.src = svgUrl;
  };

  const handleCopyMarkdown = async () => {
    if (!activeMap) return;
    const lines = [`# ${activeMap.title}`, ...nodesToMarkdown(activeMap.nodes)];
    await navigator.clipboard.writeText(lines.join('\n'));
  };

  const handleExpandSelectedNodeNote = async () => {
    if (!activeMap || !selectedNode) return;

    const targetNodeId = selectedNode.node.id;
    const parentNode = selectedNode.parentId
      ? findNodeById(activeMap.nodes, selectedNode.parentId)?.node || null
      : null;
    const siblingNodes = parentNode ? parentNode.children : activeMap.nodes;
    const siblingTitles = siblingNodes
      .filter((node) => node.id !== targetNodeId)
      .map((node) => node.title)
      .slice(0, 6);
    const childTitles = selectedNode.node.children.map((child) => child.title).slice(0, 8);

    setNodeAiError('');
    setIsNodeAiLoading(true);

    try {
      const result = await expandMindMapNodeNote({
        mapTitle: activeMap.title || '学习主题',
        nodeTitle: selectedNode.node.title || '未命名节点',
        existingNote: selectedNode.node.note || '',
        parentTitle: parentNode?.title,
        siblingTitles,
        childTitles,
        mode: nodeAiWriteMode,
      });

      updateActiveMap((map) => ({
        ...map,
        nodes: updateNodeById(map.nodes, targetNodeId, (node) => ({
          ...node,
          note:
            nodeAiWriteMode === 'append' && node.note?.trim()
              ? node.note.includes(result.note)
                ? node.note
                : `${node.note.trim()}\n\n${result.note}`
              : result.note,
        })),
        updatedAt: new Date().toISOString(),
      }));
    } catch (err) {
      setNodeAiError(err instanceof Error ? err.message : 'AI 扩写失败，请稍后重试');
    } finally {
      setIsNodeAiLoading(false);
    }
  };

  const handleToggleMapFullscreen = async () => {
    const target = mindMapPanelRef.current;
    if (!target) return;

    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    const element = target as HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    try {
      if (document.fullscreenElement || doc.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else {
          setIsMapFullscreen(false);
        }
        return;
      }

      if (target.requestFullscreen) {
        await target.requestFullscreen();
        return;
      }

      if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
        return;
      }

      setIsMapFullscreen((prev) => !prev);
    } catch {
      setIsMapFullscreen((prev) => !prev);
    }
  };

  const canStartCanvasDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return false;
    if (event.button === 1) return true;
    if (event.button !== 0) return false;
    if (isSpacePressedRef.current) return true;
    if (!(event.target instanceof HTMLElement)) return false;
    return !event.target.closest('button,input,textarea,select,a,label,[role="button"]');
  };

  const handleCanvasPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!activeMap) return;
    if (!canStartCanvasDrag(event)) return;

    panStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: panRef.current.x,
      originY: panRef.current.y,
    };
    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleCanvasPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isPanning || panStateRef.current.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - panStateRef.current.startX;
    const deltaY = event.clientY - panStateRef.current.startY;
    const nextPan = {
      x: panStateRef.current.originX + deltaX,
      y: panStateRef.current.originY + deltaY,
    };
    panRef.current = nextPan;
    setPan(nextPan);
  };

  const handleCanvasPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (panStateRef.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    panStateRef.current.pointerId = -1;
    setIsPanning(false);
  };

  const resetCanvasViewport = () => {
    setScale(1);
    setPan({ x: 24, y: 24 });
    scaleRef.current = 1;
    panRef.current = { x: 24, y: 24 };
  };

  const handleScaleChange = (nextScale: number) => {
    const safeScale = clampScale(nextScale);
    scaleRef.current = safeScale;
    setScale(safeScale);
  };

  const handleCanvasWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!activeMap) return;
    event.preventDefault();

    if (event.ctrlKey || event.metaKey) {
      const currentScale = scaleRef.current;
      const delta = event.deltaY < 0 ? 0.1 : -0.1;
      const nextScale = clampScale(currentScale + delta);
      if (Math.abs(nextScale - currentScale) < 0.001) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const anchorX = event.clientX - rect.left;
      const anchorY = event.clientY - rect.top;

      const currentPan = panRef.current;
      const contentX = (anchorX - currentPan.x) / currentScale;
      const contentY = (anchorY - currentPan.y) / currentScale;

      const nextPan = {
        x: anchorX - contentX * nextScale,
        y: anchorY - contentY * nextScale,
      };

      scaleRef.current = nextScale;
      panRef.current = nextPan;
      setScale(nextScale);
      setPan(nextPan);
      return;
    }

    const panSpeed = 1;
    const moveX = event.shiftKey ? event.deltaY : event.deltaX;
    const moveY = event.shiftKey ? 0 : event.deltaY;
    setPan((prev) => {
      const nextPan = {
        x: prev.x - moveX * panSpeed,
        y: prev.y - moveY * panSpeed,
      };
      panRef.current = nextPan;
      return nextPan;
    });
  };

  const treeScaleStyle = {
    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
    transformOrigin: 'top left',
    transition: isPanning ? 'none' : 'transform 120ms ease-out',
  } as const;

  const renderMindMapPanel = (fullscreen: boolean) => (
    <div
      ref={mindMapPanelRef}
      className={`glass-card mindmap-panel overflow-hidden p-4 transition-all sm:p-5 ${
        fullscreen
          ? 'mindmap-panel-fullscreen bg-white/95 dark:bg-slate-950/95 shadow-2xl'
          : ''
      }`}
    >
      <div
        className={`mindmap-toolbar mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
          fullscreen ? 'mindmap-toolbar-fullscreen' : ''
        }`}
      >
        <div className="text-sm text-slate-500 dark:text-slate-400">
          缩放：{Math.round(scale * 100)}%
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            onClick={resetCanvasViewport}
            className="min-h-[44px] w-full cursor-pointer rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:w-auto"
          >
            视图重置
          </button>
          <input
            className="mindmap-zoom-range w-full sm:w-40"
            type="range"
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.05}
            value={scale}
            onChange={(e) => handleScaleChange(Number(e.target.value))}
          />
          <button
            onClick={handleToggleMapFullscreen}
            className="min-h-[44px] w-full cursor-pointer rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:w-auto"
          >
            <span className="inline-flex items-center gap-1.5">
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              {fullscreen ? '窗口化' : '全屏'}
            </span>
          </button>
        </div>
      </div>
      <div className="mb-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
        空白处拖动，或按住空格 / 鼠标中键拖动画布；滚轮平移，Ctrl+滚轮缩放
      </div>
      {!activeMap && (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          请选择或创建一个导图
        </div>
      )}
      {activeMap && (
        <div
          className={`mindmap-canvas ${isPanning ? 'is-panning' : ''} ${
            isSpacePressed ? 'is-hand-ready' : ''
          }`}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerUp}
          onWheel={handleCanvasWheel}
        >
          <div className="min-w-max pb-4 pr-4 sm:pb-6 sm:pr-8">
            <div style={treeScaleStyle} className="mindmap-tree mindmap-tree-balanced">
              <div className="mindmap-root-wrap">
                <div className="mindmap-root-node">
                  <span className="mindmap-root-title">{activeMap.title}</span>
                  <span className="mindmap-root-tag">Root</span>
                </div>
              </div>
              <div
                className={`mindmap-branch-layout ${
                  hasDualRootSides ? '' : 'mindmap-branch-layout-single'
                }`}
              >
                {balancedRootNodes.left.length > 0 && (
                  <div className="mindmap-side mindmap-side-left">
                    <ul className="mindmap-side-list">
                      {balancedRootNodes.left.map((node) => (
                        <TreeNode
                          key={node.id}
                          node={node}
                          selectedId={selectedNodeId}
                          onSelect={handleSelectNode}
                          onToggle={handleToggleCollapse}
                          direction="left"
                          depth={0}
                        />
                      ))}
                    </ul>
                  </div>
                )}
                {balancedRootNodes.right.length > 0 && (
                  <div className="mindmap-side mindmap-side-right">
                    <ul className="mindmap-side-list">
                      {balancedRootNodes.right.map((node) => (
                        <TreeNode
                          key={node.id}
                          node={node}
                          selectedId={selectedNodeId}
                          onSelect={handleSelectNode}
                          onToggle={handleToggleCollapse}
                          direction="right"
                          depth={0}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={containerClass}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-600/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border-2 border-dashed border-indigo-400 bg-white/90 px-12 py-10 text-center shadow-2xl dark:bg-slate-900/90"
            >
              <FileUp className="mx-auto h-12 w-12 text-indigo-500" />
              <div className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">松开文件即可生成思维导图</div>
              <div className="mt-2 text-sm text-slate-500">支持 .txt / .md 文件</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-22 sm:px-6 sm:pb-14 sm:pt-26">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mb-8 ${isMapFullscreen ? 'relative z-[120]' : ''}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-300 mb-3">
                <Wand2 className="w-3.5 h-3.5 text-amber-500" />
                AI 思维导图工作室
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
                生成 · 编辑 · 导出 · 笔记
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                支持主题、URL、文件内容生成思维导图，结合学习进度做个性化结构优化。
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                onClick={handleCreateNew}
                className="min-h-[44px] w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> 新建导图
                </span>
              </button>
              <button
                onClick={() => handleGenerate('new')}
                disabled={isLoading}
                className="min-h-[44px] w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  <ListPlus className="w-4 h-4" /> 生成导图
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="glass-card p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-500" /> 生成来源
              </h2>
              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { id: 'topic', label: '主题' },
                  { id: 'url', label: 'URL' },
                  { id: 'file', label: '文件' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSourceTab(tab.id as SourceTab)}
                    className={`min-h-[44px] cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition ${
                      sourceTab === tab.id
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">生成模式</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setGenerationMode('full')}
                    className={`min-h-[44px] cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition border ${
                      generationMode === 'full'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    完整知识导图
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenerationMode('explore')}
                    className={`min-h-[44px] cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition border ${
                      generationMode === 'explore'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    探索模式
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {generationMode === 'explore'
                    ? '探索模式仅生成结构与节点标题，节点笔记留空，便于你自己补充。'
                    : '完整模式会生成结构和简要节点笔记。'}
                </div>
              </div>

              {sourceTab === 'topic' && (
                <div className="space-y-3">
                  <label className="text-xs text-slate-500 dark:text-slate-400">输入主题</label>
                  <input
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    placeholder="如：二叉树遍历、递归与回溯"
                  />
                </div>
              )}

              {sourceTab === 'url' && (
                <div className="space-y-3">
                  <label className="text-xs text-slate-500 dark:text-slate-400">输入 URL</label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-white/80 py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                      placeholder="https://example.com/article"
                    />
                  </div>
                  {sourcePreview?.title && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      已抓取：{sourcePreview.title}（{sourcePreview.length} 字符）
                    </div>
                  )}
                </div>
              )}

              {sourceTab === 'file' && (
                <div className="space-y-3">
                  <label className="text-xs text-slate-500 dark:text-slate-400">上传文件</label>
                  <label className="flex min-h-[48px] cursor-pointer flex-col gap-3 rounded-lg border border-dashed border-slate-300 bg-white/70 px-3 py-3 text-sm dark:border-slate-600 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex items-center gap-2">
                      <FileUp className="w-4 h-4 text-indigo-500" />
                      {fileName || '拖拽或点击上传 .txt / .md'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".txt,.md,.markdown"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    />
                  </label>
                  {fileText && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      已读取 {fileText.length} 字符
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleGenerate('new')}
                  disabled={isLoading}
                  className="min-h-[44px] w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isLoading ? '生成中...' : '生成新导图'}
                </button>
                <button
                  onClick={() => handleGenerate('update')}
                  disabled={isLoading || !activeMap}
                  className="min-h-[44px] w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> 更新当前导图
                  </span>
                </button>
                {error && <div className="text-xs text-rose-500">{error}</div>}
              </div>
            </div>

            <div className="glass-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-500" /> 导图库
              </h3>
              <div
                className={`text-xs mb-3 ${
                  syncStatus === 'error'
                    ? 'text-rose-500'
                    : syncStatus === 'syncing'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {remoteSyncEnabled
                  ? syncStatus === 'syncing'
                    ? '服务器同步中...'
                    : syncMessage || '导图已与服务器同步'
                  : userId
                    ? syncMessage || '已登录：当前仅本地保存'
                    : '未登录：当前仅本地保存'}
              </div>
              <div className="space-y-2 max-h-[360px] overflow-auto pr-2">
                {maps.length === 0 && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
                    还没有导图，先生成一个吧。
                  </div>
                )}
                {maps.map((map) => (
                  <div
                    key={map.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveMapId(map.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveMapId(map.id);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                      activeMapId === map.id
                        ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-500/10'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{map.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {map.source?.type?.toUpperCase() || 'TOPIC'} · {formatDate(map.updatedAt, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMap(map.id);
                        }}
                        aria-label="删除导图"
                        className="min-h-[44px] min-w-[44px] cursor-pointer p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0 space-y-6">
            <div className="glass-card p-5 sm:p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">导图标题</label>
                  <input
                    value={mapTitle}
                    onChange={(e) => handleUpdateTitle(e.target.value)}
                    className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 sm:w-[320px]"
                    placeholder="导图标题"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                  <button
                    onClick={handleExportJson}
                    disabled={!activeMap}
                    className="min-h-[44px] w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:text-slate-200 sm:w-auto"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Download className="w-4 h-4" /> JSON
                    </span>
                  </button>
                  <button
                    onClick={handleExportMarkdown}
                    disabled={!activeMap}
                    className="min-h-[44px] w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:text-slate-200 sm:w-auto"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Download className="w-4 h-4" /> Markdown
                    </span>
                  </button>
                  <button
                    onClick={handleExportSvg}
                    disabled={!activeMap}
                    className="min-h-[44px] w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:text-slate-200 sm:w-auto"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Download className="w-4 h-4" /> SVG
                    </span>
                  </button>
                  <button
                    onClick={handleExportPng}
                    disabled={!activeMap}
                    className="min-h-[44px] w-full cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 sm:w-auto"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Download className="w-4 h-4" /> PNG
                    </span>
                  </button>
                  <button
                    onClick={handleCopyMarkdown}
                    disabled={!activeMap}
                    className="min-h-[44px] w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:text-slate-200 sm:w-auto"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Copy className="w-4 h-4" /> 复制大纲
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`grid gap-6 ${
                isMapFullscreen ? 'grid-cols-1' : 'xl:grid-cols-[minmax(0,1fr)_360px]'
              }`}
            >
              {renderMindMapPanel(isMapFullscreen)}
              {!isMapFullscreen && (
                <div className="glass-card space-y-4 p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">节点编辑</h3>
                {!selectedNode && (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    请选择一个节点进行编辑。
                  </div>
                )}
                {selectedNode && (
                  <>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">节点标题</label>
                      <input
                        value={selectedNode.node.title}
                        onChange={(e) =>
                          updateActiveMap((map) => ({
                            ...map,
                            nodes: updateNodeById(map.nodes, selectedNode.node.id, (node) => ({
                              ...node,
                              title: e.target.value,
                            })),
                            updatedAt: new Date().toISOString(),
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">笔记</label>
                      <textarea
                        value={selectedNode.node.note || ''}
                        onChange={(e) =>
                          updateActiveMap((map) => ({
                            ...map,
                            nodes: updateNodeById(map.nodes, selectedNode.node.id, (node) => ({
                              ...node,
                              note: e.target.value,
                            })),
                            updatedAt: new Date().toISOString(),
                          }))
                        }
                        rows={5}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 text-sm"
                        placeholder="记录关键理解、例子或待复习点"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col items-start justify-between gap-2 text-[11px] sm:flex-row sm:items-center">
                        <span className="text-slate-500 dark:text-slate-400">写入方式</span>
                        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setNodeAiWriteMode('replace')}
                            className={`min-h-[44px] px-3 py-2 transition ${
                              nodeAiWriteMode === 'replace'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/80 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            覆盖
                          </button>
                          <button
                            type="button"
                            onClick={() => setNodeAiWriteMode('append')}
                            className={`min-h-[44px] px-3 py-2 transition ${
                              nodeAiWriteMode === 'append'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/80 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            追加
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handleExpandSelectedNodeNote}
                        disabled={isNodeAiLoading}
                        className="min-h-[44px] w-full cursor-pointer rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 hover:bg-amber-100 disabled:opacity-60 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Wand2 className="w-4 h-4" />
                          {isNodeAiLoading
                            ? 'AI 扩写中...'
                            : nodeAiWriteMode === 'append'
                              ? 'AI 追加当前节点笔记'
                              : 'AI 扩写当前节点笔记'}
                        </span>
                      </button>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        基于当前节点、父子节点上下文自动补全“定义/要点/易错点”。
                      </div>
                      {nodeAiError && <div className="text-xs text-rose-500">{nodeAiError}</div>}
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        onClick={handleAddChild}
                        className="min-h-[44px] cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Plus className="w-4 h-4" /> 添加子节点
                        </span>
                      </button>
                      <button
                        onClick={handleAddSibling}
                        className="min-h-[44px] cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ListPlus className="w-4 h-4" /> 添加同级
                        </span>
                      </button>
                      <button
                        onClick={() => handleMoveNode('up')}
                        className="min-h-[44px] cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <span className="inline-flex items-center gap-2">
                          <MoveUp className="w-4 h-4" /> 上移
                        </span>
                      </button>
                      <button
                        onClick={() => handleMoveNode('down')}
                        className="min-h-[44px] cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <span className="inline-flex items-center gap-2">
                          <MoveDown className="w-4 h-4" /> 下移
                        </span>
                      </button>
                      <button
                        onClick={handleDeleteNode}
                        className="min-h-[44px] cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-100 sm:col-span-2"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> 删除节点
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function TreeNode({
  node,
  selectedId,
  onSelect,
  onToggle,
  direction,
  depth,
}: {
  node: MindMapNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  direction: 'left' | 'right';
  depth: number;
}) {
  const isSelected = selectedId === node.id;
  const hasChildren = node.children.length > 0;
  const layoutTransition = {
    duration: 0.2,
    ease: [0.22, 1, 0.36, 1] as const,
  };
  const depthStyle = {
    '--mind-node-depth': Math.min(depth + 1, 6),
  } as CSSProperties;
  const nodeButton = (
    <button
      onClick={() => onSelect(node.id)}
      className={`mindmap-node mindmap-node-${direction} px-4 py-2 rounded-xl border text-left transition ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow'
          : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 hover:border-indigo-300'
      }`}
      style={depthStyle}
    >
      <div className="font-medium text-slate-900 dark:text-white text-sm">{node.title}</div>
      {node.note && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{node.note}</div>}
    </button>
  );

  return (
    <motion.li
      layout="position"
      initial={false}
      transition={{ layout: layoutTransition }}
      className={`mindmap-tree-node ${direction}`}
    >
      <motion.div
        layout="position"
        transition={{ layout: layoutTransition }}
        className={`mindmap-row mindmap-row-${direction}`}
      >
        {direction === 'left' && nodeButton}
        <span className={`mindmap-link mindmap-link-${direction}`} />
        {hasChildren ? (
          <button
            onClick={() => onToggle(node.id)}
            className="mindmap-toggle-btn text-slate-400 hover:text-indigo-500"
            aria-label={node.collapsed ? '展开子节点' : '折叠子节点'}
          >
            {node.collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        ) : (
          <span className="mindmap-toggle-space" />
        )}
        {direction === 'right' && nodeButton}
      </motion.div>
      <AnimatePresence initial={false}>
        {hasChildren && !node.collapsed && (
          <motion.ul
            key={`${node.id}_children`}
            className={`mindmap-children ${direction}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={layoutTransition}
            style={{ overflow: 'hidden' }}
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                selectedId={selectedId}
                onSelect={onSelect}
                onToggle={onToggle}
                direction={direction}
                depth={depth + 1}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
