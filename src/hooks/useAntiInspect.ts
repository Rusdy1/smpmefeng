import { useEffect } from 'react';

/**
 * Hook to apply client-side anti-inspect protections:
 * - Disable right-click context menu
 * - Block developer tool shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, etc.)
 * - Prevent drag-and-drop of images / selection stealing
 */
export function useAntiInspect() {
  useEffect(() => {
    // 1. Disable context menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      // Allow context menu only on inputs or textareas if user needs to copy/paste text
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      return false;
    };

    // 2. Block Keyboard Shortcuts commonly used to inspect/view source
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + I (Inspect Elements)
      // Ctrl + Shift + J (Console)
      // Ctrl + Shift + C (Element selector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (
        e.key === 'I' || e.key === 'i' ||
        e.key === 'J' || e.key === 'j' ||
        e.key === 'C' || e.key === 'c'
      )) {
        e.preventDefault();
        return false;
      }

      // Ctrl + U / Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
      }

      // Ctrl + S / Cmd + S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Disable Dragging images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
}
