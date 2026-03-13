import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';

const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label'] as const;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'PRE', 'CODE']);

export default function LocalizationBridge() {
  const { locale, t } = useI18n();
  const location = useLocation();
  const textOriginalsRef = useRef(new WeakMap<Text, string>());
  const attrOriginalsRef = useRef(new WeakMap<Element, Map<string, string>>());
  const isApplyingRef = useRef(false);

  useEffect(() => {
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
        const original = textOriginalsRef.current.get(textNode) ?? textNode.textContent ?? '';
        textOriginalsRef.current.set(textNode, original);
        textNode.textContent = t(original);
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
          const original = attributeMap?.get(attr) ?? current;
          attributeMap?.set(attr, original);
          element.setAttribute(attr, t(original));
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

    applyAll(document.body);

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

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => observer.disconnect();
  }, [locale, location.pathname, t]);

  return null;
}
