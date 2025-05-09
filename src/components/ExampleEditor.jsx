import React, { useState, useRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  convertFromHTML,
  RichUtils,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Toolbar from "./Toolbar";

const ExampleEditor = () => {
  const ref = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [savedSelection, setSavedSelection] = useState(null);

  const [editorState, setEditorState] = useState(() => {
    const sampleHTML =
      "<p>This is some <b>bold</b> text.</p><p>Here is a list:</p><ul><li>Item 1</li><li>Item 2</li></ul>";

    // Store the sampleHTML in localStorage only if not already stored
    if (!localStorage.getItem("editorInitialHTML")) {
      localStorage.setItem("editorInitialHTML", sampleHTML);
    }

    const blocksFromHTML = convertFromHTML(sampleHTML);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks, // Each paragraph, list, etc. is a "block"
      blocksFromHTML.entityMap // Like images, links, or mentions (if any)
    );
    return EditorState.createWithContent(contentState);
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleEditorChange = (state) => {
    setEditorState(state);
    const selection = state.getSelection();
    if (selection.getHasFocus()) {
      setSavedSelection(selection);
    }
  };

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  }

  const currentStyle = editorState.getCurrentInlineStyle();

  // toggleInlineStyle for bold, italic, underline, strikethrough
  function toggleInlineStyle(style) {
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    setEditorState(newState);
  }

  // toggleBlockType for list items
  function toggleBlockType(type) {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  }

  // toggleAlignment for left, center, right, justify
  function toggleAlignment(alignment) {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const blockData = block.getData();
    const currentAlignment = blockData.get("text-align");

    const newAlignment = currentAlignment === alignment ? undefined : alignment;
    const newBlockData = blockData.set("text-align", newAlignment);

    const newContentState = Modifier.setBlockData(
      currentContent,
      selection,
      newBlockData
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-block-data"
    );

    setEditorState(EditorState.forceSelection(newEditorState, selection));
  }

  function blockStyleFn(contentBlock) {
    const alignment = contentBlock.getData().get("text-align");
    if (alignment) {
      return `align-${alignment}`;
    }
    return "";
  }

  function getCurrentBlockAlignment() {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    return block.getData().get("text-align") || "left";
  }

  const onEmojiClick = (emojiData) => {
    let selection = editorState.getSelection();

    // If the selection is not focused, use the saved one
    if (!selection.getHasFocus() && savedSelection) {
      selection = savedSelection;
    }

    // Ensure selection is valid
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    if (!block) return;

    // Delay emoji insertion to allow refocusing
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }

      const editorStateWithFocus = EditorState.forceSelection(
        editorState,
        selection
      );

      const newContentState = Modifier.insertText(
        editorStateWithFocus.getCurrentContent(),
        selection,
        emojiData.emoji
      );

      const newEditorState = EditorState.push(
        editorStateWithFocus,
        newContentState,
        "insert-characters"
      );

      setEditorState(
        EditorState.forceSelection(
          newEditorState,
          newContentState.getSelectionAfter()
        )
      );

      setShowEmojiPicker(false);
    }, 0);
  };

  return (
    <div className="editor-container">
      <Toolbar
        editorState={editorState}
        currentStyle={currentStyle}
        getCurrentBlockAlignment={getCurrentBlockAlignment}
        toggleInlineStyle={toggleInlineStyle}
        toggleBlockType={toggleBlockType}
        toggleAlignment={toggleAlignment}
        setEditorState={setEditorState}
        setShowEmojiPicker={setShowEmojiPicker}
        showEmojiPicker={showEmojiPicker}
        onEmojiClick={onEmojiClick}
        savedSelection={savedSelection}
      />

      <div className="editor-wrapper">
        <Editor
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          ref={ref}
          onChange={handleEditorChange}
          blockStyleFn={blockStyleFn}
        />
      </div>
    </div>
  );
};

export default ExampleEditor;
