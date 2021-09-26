import React, { useEffect, useRef, useState } from "react";
import {
  Editor as DraftEditor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";

export function Editor({
  value = "",
  onChange = (newValue: string) => {},
}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      console.log(value)
      const blocks = convertFromHTML(value);
      const content = ContentState.createFromBlockArray(
        blocks.contentBlocks,
        blocks.entityMap
      );

      setEditorState(EditorState.createWithContent(content));
    }
  }, [value]);

  function handlerChange(ev: any) {
    console.log("onchange");
    setEditorState(ev);

    onChange(
      editorRef?.querySelector(".public-DraftEditor-content div")?.innerHTML ||
        ""
    );
  }

  function handleKeyCommand(
    command: string,
    state: EditorState
  ): "handled" | "not-handled" {
    if (command === "OL") {
      setEditorState(
        RichUtils.toggleBlockType(editorState, "ordered-list-item")
      );

      return "not-handled";
    }

    if (command === "UL") {
      setEditorState(
        RichUtils.toggleBlockType(editorState, "unordered-list-item")
      );

      return "not-handled";
    }

    const newState = RichUtils.toggleInlineStyle(
      editorState,
      command.toUpperCase()
    );

    if (newState) {
      setEditorState(newState);
    }

    return "not-handled";
  }

  function keyBinding(ev: any): string | null {
    if (ev.keyCode === 83 && ev.ctrlKey) {
      return "STRIKETHROUGH";
    }

    if (ev.keyCode === 192 && ev.ctrlKey && ev.shiftKey) {
      return "OL";
    }

    if (ev.keyCode === 219 && ev.ctrlKey && ev.shiftKey) {
      return "UL";
    }

    if (ev.keyCode === 9) {
      setEditorState(RichUtils.onTab(ev, editorState, 5));
    }

    return getDefaultKeyBinding(ev);
  }

  return (
    <div ref={setEditorRef}>
      <DraftEditor
        customStyleMap={{
          STRIKETHROUGH: { textDecoration: "line-through" },
        }}
        keyBindingFn={keyBinding}
        handleKeyCommand={handleKeyCommand}
        editorState={editorState}
        onChange={handlerChange}
      />
    </div>
  );
}
