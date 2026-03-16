import { useEffect, useRef } from 'react';
import { useI18n } from '../contexts/I18nContext';

const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label'] as const;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'PRE', 'CODE']);

export default function LocalizationBridge() {
  const { locale, t } = useI18n();
  const textOriginalsRef = useRef(new WeakMap<Text, string>());
  const attrOriginalsRef = useRef(new WeakMap<Element, Map<string, string>>());
  const isApplyingRef = useRef(false);

  useEffect(() => {
    const root = document.body;
    let frameId: number | null = null;

    const shouldSkip = (element: Element | null) => {
      if (!element) return true;
      if (SKIP_TAGS.has(element.tagName)) return true;
      return Boolean(element.closest('pre, code, textarea, script, style'));
    };

    const applyTextTranslations = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (!(node instanceof Text)) return NodeFilter.FILTER_REJECT;
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          if (shouldSkip(node.parentElement)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let current = walker.nextNode();
      while (current) {
        const textNode = current as Text;
        const currentText = textNode.textContent ?? '';
        const cachedOriginal = textOriginalsRef.current.get(textNode);
        const original = cachedOriginal && currentText === t(cachedOriginal) ? cachedOriginal : currentText;
        const translated = t(original);
        textOriginalsRef.current.set(textNode, original);
        if (currentText !== translated) {
          textNode.textContent = translated;
        }
        current = walker.nextNode();
      }
    };

    const applyAttributeTranslations = (root: ParentNode) => {
      const selector = TRANSLATABLE_ATTRIBUTES.map((attr) => `[${attr}]`).join(',');
      root.querySelectorAll(selector).forEach((element) => {
        if (shouldSkip(element)) return;
        let attributeMap = attrOriginalsRef.current.get(element);
        if (!attributeMap) {
          attributeMap = new Map<string, string>();
          attrOriginalsRef.current.set(element, attributeMap);
        }

        TRANSLATABLE_ATTRIBUTES.forEach((attr) => {
          const current = element.getAttribute(attr);
          if (!current) return;
          const cachedOriginal = attributeMap?.get(attr);
          const original = cachedOriginal && current === t(cachedOriginal) ? cachedOriginal : current;
          const translated = t(original);
          attributeMap?.set(attr, original);
          if (current !== translated) {
            element.setAttribute(attr, translated);
          }
        });
      });
    };

    const applyAll = (root: Node | null) => {
      if (!root) return;
      isApplyingRef.current = true;
      applyTextTranslations(root);
      if (root instanceof Element || root instanceof DocumentFragment || root instanceof Document) {
        applyAttributeTranslations(root);
      }
      isApplyingRef.current = false;
    };

    const scheduleFullApply = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(() => {
        applyAll(root);
      });
    };

    scheduleFullApply();

    const observer = new MutationObserver((mutations) => {
      if (isApplyingRef.current) return;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          applyAll(mutation.target);
          continue;
        }

        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          applyAll(mutation.target);
          continue;
        }

        mutation.addedNodes.forEach((node) => applyAll(node));
      }
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => {
      observer.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [locale, t]);

  return null;
}
