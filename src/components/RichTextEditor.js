import { useEffect, useRef } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

const encodeHtml = (text = '') => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const plainTextToHtml = (text = '') => {
  if (!text) {
    return '';
  }
  return text
    .split('\n')
    .map((line) => (line.length ? `<div>${encodeHtml(line)}</div>` : '<div><br /></div>'))
    .join('');
};

const htmlToPlainText = (html = '') => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return html;
  }

  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = html;
  return tempContainer.textContent.replace(/\u00a0/g, ' ');
};

const RichTextEditor = ({ label, value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    const currentPlainText = htmlToPlainText(editorRef.current.innerHTML);
    if ((value || '') === currentPlainText) {
      return;
    }
    editorRef.current.innerHTML = plainTextToHtml(value || '');
  }, [value]);

  const handleInput = () => {
    if (!editorRef.current) {
      return;
    }
    const currentText = htmlToPlainText(editorRef.current.innerHTML);
    onChange?.(currentText);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
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
    <div className="rich-text-editor">
      {label && <label className="form-label">{label}</label>}
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
