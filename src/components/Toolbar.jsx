import React, { lazy, Suspense } from "react";
import { EditorState } from "draft-js";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CodeXml,
  Italic,
  List,
  ListOrdered,
  RotateCcw,
  RotateCw,
  Smile,
  Strikethrough,
  Underline,
} from "lucide-react";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

const Toolbar = ({
  editorState,
  currentStyle,
  getCurrentBlockAlignment,
  toggleInlineStyle,
  toggleBlockType,
  toggleAlignment,
  setEditorState,
  setShowEmojiPicker,
  showEmojiPicker,
  onEmojiClick,
}) => {
  return (
    <div className="toolbar">
      {/* Inline styles */}
      <button
        className={currentStyle.has("BOLD") ? "active" : ""}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleInlineStyle("BOLD");
        }}
      >
        <Bold />
      </button>

      <button
        className={currentStyle.has("ITALIC") ? "active" : ""}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleInlineStyle("ITALIC");
        }}
      >
        <Italic />
      </button>

      <button
        className={currentStyle.has("UNDERLINE") ? "active" : ""}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleInlineStyle("UNDERLINE");
        }}
      >
        <Underline />
      </button>

      <button
        className={
          editorState
            .getCurrentContent()
            .getBlockForKey(editorState.getSelection().getStartKey())
            .getType() === "ordered-list-item"
            ? "active"
            : ""
        }
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("ordered-list-item");
        }}
      >
        <ListOrdered />
      </button>

      <button
        className={
          editorState
            .getCurrentContent()
            .getBlockForKey(editorState.getSelection().getStartKey())
            .getType() === "unordered-list-item"
            ? "active"
            : ""
        }
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("unordered-list-item");
        }}
      >
        <List />
      </button>

      <button
        className={currentStyle.has("STRIKETHROUGH") ? "active" : ""}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleInlineStyle("STRIKETHROUGH");
        }}
      >
        <Strikethrough />
      </button>

      {/* Alignment buttons */}
      {["left", "center", "right", "justify"].map((align) => {
        const Icon =
          {
            left: AlignLeft,
            center: AlignCenter,
            right: AlignRight,
            justify: AlignJustify,
          }[align] || AlignLeft;

        return (
          <button
            key={align}
            className={getCurrentBlockAlignment() === align ? "active" : ""}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleAlignment(align);
            }}
          >
            <Icon />
          </button>
        );
      })}

      {/* Emoji Picker */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setShowEmojiPicker((prev) => !prev);
        }}
      >
        <Smile />
      </button>
      {showEmojiPicker && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="emoji-picker-container visible"
        >
          <Suspense fallback={<div className="loading">Loading emojis...</div>}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </Suspense>
        </div>
      )}

      {/* Undo / Redo */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setEditorState(EditorState.undo(editorState));
        }}
      >
        <RotateCcw />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setEditorState(EditorState.redo(editorState));
        }}
      >
        <RotateCw />
      </button>

      {/* Code block */}
      <button
        className={
          editorState
            .getCurrentContent()
            .getBlockForKey(editorState.getSelection().getStartKey())
            .getType() === "code-block"
            ? "active"
            : ""
        }
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType("code-block");
        }}
      >
        <CodeXml />
      </button>
    </div>
  );
};

export default Toolbar;
