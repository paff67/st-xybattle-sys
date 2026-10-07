import { parseBattlePacketMarkers } from './battle-packet-markers.js';

function elementDocument(root, documentRef) { return documentRef || root?.ownerDocument || globalThis.document; }

function isFolded(node) { return node?.nodeType === 1 && node.hasAttribute?.('data-xy-battle-packet-key'); }

function textNodes(root) {
  const output = [];
  const visit = (node) => {
    if (!node || isFolded(node)) return;
    if (node.nodeType === 3) { output.push(node); return; }
    for (const child of [...(node.childNodes || [])]) visit(child);
  };
  visit(root);
  return output;
}

function renderedParts(root) {
  const parts = [];
  const visit = (node) => {
    if (!node || isFolded(node)) return;
    if (node.nodeType === 3) { parts.push({ node, length: node.nodeValue?.length || 0, text: node.nodeValue || '' }); return; }
    if (node.nodeType === 1 && String(node.tagName).toLowerCase() === 'br') { parts.push({ node: null, length: 1, text: '\n' }); return; }
    for (const child of [...(node.childNodes || [])]) visit(child);
  };
  visit(root);
  return parts;
}

function locateTextOffset(nodes, offset, end = false) {
  let cursor = 0;
  for (let index = 0; index < nodes.length; index += 1) {
    const part = nodes[index], length = part.length;
    if (offset <= cursor + length || (end && offset === cursor + length)) {
      if (part.node) return { node: part.node, offset: Math.max(0, Math.min(length, offset - cursor)) };
      const previous = [...nodes.slice(0, index)].reverse().find((item) => item.node);
      const next = nodes.slice(index + 1).find((item) => item.node);
      return end && previous ? { node: previous.node, offset: previous.length } : next ? { node: next.node, offset: 0 } : previous ? { node: previous.node, offset: previous.length } : null;
    }
    cursor += length;
  }
  const last = [...nodes].reverse().find((item) => item.node);
  return last ? { node: last.node, offset: last.length } : null;
}

function foldRange(root, entry, doc, placeholder) {
  const nodes = renderedParts(root);
  const start = locateTextOffset(nodes, entry.start);
  const end = locateTextOffset(nodes, entry.end, true);
  if (!start || !end || !doc.createRange) return false;
  const range = doc.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);
  const details = doc.createElement('details');
  details.dataset.xyBattlePacketKey = entry.key;
  details.setAttribute('data-xy-battle-packet-key', entry.key);
  const summary = doc.createElement('summary');
  summary.textContent = `${placeholder}${entry.packet?.actionId ? ` · ${entry.packet.actionId}` : ''}`;
  details.appendChild(summary);
  const pre = doc.createElement('pre');
  pre.className = 'xy-battle-packet-source';
  pre.textContent = entry.raw;
  details.appendChild(pre);
  range.deleteContents();
  range.insertNode(details);
  range.detach?.();
  return true;
}

/**
 * Fold marker blocks in a rendered DOM projection. This function never writes
 * to chat storage or the textarea used by the generation pipeline.
 */
export function foldBattlePacketDom(root, { documentRef, placeholder = '战斗场景包（已折叠）' } = {}) {
  const doc = elementDocument(root, documentRef);
  if (!root || !doc?.createElement) return { folded: 0, available: false };
  let folded = 0;
  const containers = root.matches?.('.mes_text') ? [root] : [...(root.querySelectorAll?.('.mes_text') || [])];
  if (!containers.length) containers.push(root);
  for (const container of containers) {
    // Use the rendered text projection and DOM ranges so a marker split across
    // <p>, <em>, <code>, or <br> text nodes is folded without touching sibling
    // links/formatting. Process from the end so earlier offsets stay stable.
    const parts = renderedParts(container), source = parts.map((part) => part.text).join('');
    const entries = parseBattlePacketMarkers(source);
    for (const entry of [...entries].reverse()) if (foldRange(container, entry, doc, placeholder)) folded += 1;
  }
  return { folded, available: true };
}

export class HostDisplayFolding {
  constructor({ documentRef = globalThis.document, root, rootSelector = '#chat', placeholder } = {}) {
    Object.assign(this, { documentRef, root, rootSelector, placeholder });
    this.observer = null;
    this.boundRoots = new Set();
  }

  resolveRoot() { return this.root || this.documentRef?.querySelector?.(this.rootSelector); }

  apply(root = this.resolveRoot()) { return foldBattlePacketDom(root, { documentRef: this.documentRef, placeholder: this.placeholder }); }

  observe(root = this.resolveRoot()) {
    if (!root || !this.documentRef?.defaultView?.MutationObserver && !globalThis.MutationObserver) return { observed: false, reason: 'MutationObserver is unavailable' };
    this.boundRoots.add(root);
    const Observer = this.documentRef?.defaultView?.MutationObserver || globalThis.MutationObserver;
    if (!this.observer) {
      this.observer = new Observer((mutations) => {
        for (const mutation of mutations) if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const target = mutation.target?.nodeType === 1 ? mutation.target : mutation.target?.parentElement;
          if (target) this.apply(target.closest?.('.mes_text') || target);
        }
      });
    }
    this.observer.observe(root, { childList: true, subtree: true, characterData: true });
    this.apply(root);
    return { observed: true };
  }

  disconnect() { this.observer?.disconnect?.(); this.observer = null; this.boundRoots.clear(); }
  dispose() { this.disconnect(); }
}

export function createHostDisplayFolding(options) { return new HostDisplayFolding(options); }

