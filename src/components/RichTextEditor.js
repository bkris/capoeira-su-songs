import { useEffect, useRef } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

const INLINE_TAG_REGEX = /<\/?(b|i|u)>/gi;

const escapeHtml = (text = '') => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const normalizeInlineTags = (text = '') => text
  .replace(/<\/?strong>/gi, (match) => (match.startsWith('</') ? '</b>' : '<b>'))
  .replace(/<\/?em>/gi, (match) => (match.startsWith('</') ? '</i>' : '<i>'));

const escapeHtmlPreservingInlineTags = (text = '') => {
  const placeholders = [];
  const normalized = normalizeInlineTags(text || '');
  const replaced = normalized.replace(INLINE_TAG_REGEX, (match) => {
    const placeholder = `__tag__${placeholders.length}__`;
    placeholders.push({ placeholder, value: match.toLowerCase() });
    return placeholder;
  });
  let escaped = escapeHtml(replaced);
  placeholders.forEach(({ placeholder, value }) => {
    const pattern = new RegExp(placeholder, 'g');
    escaped = escaped.replace(pattern, value);
  });
  return escaped;
};

const convertValueToEditorHtml = (value = '') => (value || '')
  .split('\n')
  .map((line) => (line.length ? `<div>${escapeHtmlPreservingInlineTags(line)}</div>` : '<div><br /></div>'))
  .join('');

const convertValueToInlineHtml = (value = '') => escapeHtmlPreservingInlineTags(value || '');

const serializeNode = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml((node.textContent || '').replace(/\u00a0/g, ' '));
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const tag = node.tagName.toLowerCase();

  if (tag === 'br') {
    return '\n';
  }
  if (tag === 'b' || tag === 'strong') {
    const content = serializeChildren(node);
    return content ? `<b>${content}</b>` : '';
  }
  if (tag === 'i' || tag === 'em') {
    const content = serializeChildren(node);
    return content ? `<i>${content}</i>` : '';
  }
  if (tag === 'u') {
    const content = serializeChildren(node);
    return content ? `<u>${content}</u>` : '';
  }
  if (tag === 'span') {
    const style = (node.getAttribute('style') || '').toLowerCase();
    const wrappers = [];
    if (/font-weight\s*:\s*(bold|[5-9]00)/.test(style)) {
      wrappers.push('b');
    }
    if (/font-style\s*:\s*italic/.test(style)) {
      wrappers.push('i');
    }
    if (/text-decoration\s*:\s*underline/.test(style)) {
      wrappers.push('u');
    }
    let content = serializeChildren(node);
    if (!content) {
      return content;
    }
    wrappers.forEach((wrapperTag) => {
      content = `<${wrapperTag}>${content}</${wrapperTag}>`;
    });
    return content;
  }
  if (tag === 'ul' || tag === 'ol') {
    return Array
      .from(node.children || [])
      .filter((child) => child.tagName && child.tagName.toLowerCase() === 'li')
      .map((li) => serializeChildren(li))
      .join('\n');
  }
  if (tag === 'li') {
    return serializeChildren(node);
  }
  if (tag === 'div' || tag === 'p') {
    return serializeChildren(node);
  }
  return serializeChildren(node);
};

const serializeChildren = (element) => Array
  .from(element.childNodes || [])
  .map((child) => serializeNode(child))
  .join('');

const editorHtmlToValue = (html = '') => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return html || '';
  }

  const container = document.createElement('div');
  container.innerHTML = html || '';

  const lines = [];
  container.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = (node.textContent || '').replace(/\u00a0/g, ' ');
      if (textContent.trim()) {
        lines.push(escapeHtml(textContent));
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const tag = node.tagName.toLowerCase();
    if (tag === 'div' || tag === 'p') {
      const content = serializeChildren(node);
      if (/^\n+$/.test(content)) {
        lines.push('');
      } else {
        lines.push(content);
      }
      return;
    }
    if (tag === 'br') {
      lines.push('');
      return;
    }
    const content = serializeNode(node);
    if (content) {
      lines.push(content);
    }
  });

  while (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
};

const RichTextEditor = ({ label, value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    const currentValue = editorHtmlToValue(editorRef.current.innerHTML);
    if ((value || '') === currentValue) {
      return;
    }
    editorRef.current.innerHTML = convertValueToEditorHtml(value || '');
  }, [value]);

  const handleInput = () => {
    if (!editorRef.current) {
      return;
    }
    const currentValue = editorHtmlToValue(editorRef.current.innerHTML);
    onChange?.(currentValue);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain') || '';
    if (!text) {
      return;
    }
    const normalized = text.replace(/\\n/g, '\n');
    if (normalized.includes('\n')) {
      document.execCommand('insertHTML', false, convertValueToEditorHtml(normalized));
      return;
    }
    if (/<\/?(b|i|u)>/i.test(normalized)) {
      document.execCommand('insertHTML', false, convertValueToInlineHtml(normalized));
      return;
    }
    document.execCommand('insertText', false, normalized);
  };

  const applyFormat = (command) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const toolbarButtons = [
    { icon: 'B', command: 'bold', title: 'Bold', style: { fontWeight: 'bold' } },
    { icon: 'I', command: 'italic', title: 'Italic', style: { fontStyle: 'italic' } },
    { icon: 'U', command: 'underline', title: 'Underline', style: { textDecoration: 'underline' } },
    { icon: '•', command: 'insertUnorderedList', title: 'Bulleted list' }
  ];

  return (
    <div className="rich-text-editor mt-1">
      {label && <label className="form-label me-2">{label}</label>}
      <ButtonGroup size="sm" className="editor-toolbar mb-2">
        {toolbarButtons.map((button) => (
          <Button
            key={button.command}
            variant="outline-secondary"
            title={button.title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyFormat(button.command)}
            style={button.style}
          >
            {button.icon}
          </Button>
        ))}
      </ButtonGroup>
      <div
        ref={editorRef}
        className="editor-surface form-control"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        role="textbox"
        aria-multiline="true"
        aria-label={label || placeholder || 'Rich text editor'}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
