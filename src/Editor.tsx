import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import ToolbarPlugin from './plugins/ToolbarPlugin';

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

function SelectionPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const unregister = editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const selectedTextContent = selection.getTextContent();
          setSelectedText(selectedTextContent);
        } else {
          setSelectedText('');
        }
      });
    });

    return () => {
      unregister();
    };
  }, [editor]);

  return (
    <div>
      <p style={{color: 'red'}}>Selected Text: {selectedText || 'No text selected'}</p>
    </div>
  );
}

export default function Editor() {
  return (
    <div className="editor-container">
      <ToolbarPlugin />
      <div className="editor-inner">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <AutoFocusPlugin />
        <SelectionPlugin />
      </div>
    </div>
  );
}
