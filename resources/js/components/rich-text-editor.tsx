import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                'rounded p-1.5 transition-colors hover:bg-muted',
                isActive && 'bg-muted text-foreground',
                !isActive && 'text-muted-foreground',
                disabled && 'cursor-not-allowed opacity-40',
            )}
        >
            {children}
        </button>
    );
}

export function RichTextEditor({ value, onChange, placeholder = 'Tulis deskripsi kegiatan...', error }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-[180px] px-3 py-2 focus:outline-none',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div
            className={cn(
                'overflow-hidden rounded-md border bg-background',
                error ? 'border-destructive' : 'border-input',
                'focus-within:ring-ring focus-within:ring-1',
            )}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
                <ToolbarButton
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    title="Underline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-4 w-px bg-border" />

                <ToolbarButton
                    title="Heading"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-4 w-px bg-border" />

                <ToolbarButton
                    title="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    title="Ordered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />
        </div>
    );
}
