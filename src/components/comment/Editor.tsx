import React, { FC, useCallback, useEffect, useState } from 'react';
import Draft from 'draft-js';
import { draftjsToMd, mdToDraftjs } from 'draftjs-md-converter'

import './Editor.scss';

export const Editor: FC<EditorProps> = ({html, onChangeContent = e => {}}) => {

    const blocks = Draft.convertFromRaw(mdToDraftjs(html, extraStyles))

    const [editorState, setEditorState] = useState(
        Draft.EditorState.createWithContent(blocks)
    );

    const onChangeText = useCallback(ev => {
        setEditorState(old => ev);

        const blocks = Draft.convertToRaw(editorState.getCurrentContent())
        const md = draftjsToMd(blocks, extraStyles)

        onChangeContent(md)
    }, [editorState])

    const changeStyle = (style: string) => {
        onChangeText(Draft.RichUtils.toggleInlineStyle(editorState, style))
    }

    return (
        <div>
            <div className="editor-toolbar">
                <button onClick={e => changeStyle('BOLD')}>
                    <i className="fas fa-bold"></i>
                </button>
                <button onClick={e => changeStyle('ITALIC')}>
                    <i className="fas fa-italic"></i>
                </button>
                <button onClick={e => changeStyle('RISCADO')}>
                    <i className="fas fa-strikethrough"></i>
                </button>
                <button onClick={e => changeStyle('UNDERLINE')}>
                    <i className="fas fa-underline"></i>
                </button>
            </div>
            <Draft.Editor
                customStyleMap={styleMap}
                onChange={onChangeText}
                editorState={editorState} />
        </div>
    )
}

export const styleMap = {
    'RISCADO': {
        textDecoration: 'line-through'
    }
}

export const extraStyles = {
    'RISCADO': '~~'
}

export interface EditorProps  {
    html: string;
    onChangeContent?: (md: string) => void;
}