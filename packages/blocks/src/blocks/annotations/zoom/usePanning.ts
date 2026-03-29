import { useEffect, useState } from 'react';

/**
 * Tracks whether the Ctrl key (or Meta on macOS) is currently held down.
 * Used to activate pan mode - Ctrl+drag pans the viewport.
 *
 * Ctrl is used instead of Space to avoid conflicts with interactive elements
 * (text inputs, buttons) inside the zoom container.
 */
export function usePanning() {
    const [isPanning, setIsPanning] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Control' || event.key === 'Meta') {
                setIsPanning(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Control' || event.key === 'Meta') {
                setIsPanning(false);
            }
        };

        // Also reset on blur (e.g. user switches window while holding Ctrl)
        const handleBlur = () => {
            setIsPanning(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    return { isPanning, setIsPanning };
}
