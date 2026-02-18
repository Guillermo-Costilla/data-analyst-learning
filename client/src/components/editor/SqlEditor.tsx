import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';

interface SqlEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    height?: string;
    readOnly?: boolean;
}

const SqlEditor: React.FC<SqlEditorProps> = ({
    value,
    onChange,
    readOnly = false,
}) => {
    const editorRef = useRef<any>(null);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;
    };

    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-[#1e1e1e]">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <span className="text-gray-300 text-sm font-medium">SQL Editor</span>
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
            </div>
            <Editor
                height="90vh"
                defaultLanguage="sql"
                value={value}
                onChange={onChange}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    readOnly: readOnly,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    padding: { top: 10 },
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default SqlEditor;
