import { ReactNode, useRef } from 'react';
import {
    ActionButton,
    ButtonGroup,
    Content,
    Dialog,
    DialogTrigger,
    Divider,
    Heading,
    Tooltip,
    TooltipTrigger,
} from '@adobe/react-spectrum';
import { DOMRefValue } from '@react-types/shared';
import FullScreen from '@spectrum-icons/workflow/FullScreen';
import FullScreenExit from '@spectrum-icons/workflow/FullScreenExit';

export interface FullscreenActionProps {
    /** The content to display in the fullscreen dialog. */
    children: ReactNode;
    /** The title of the fullscreen dialog. */
    title?: string | ReactNode;
    /** An optional action button to display in the dialog header. */
    actionButton?: ((ref: DOMRefValue<HTMLElement> | null) => ReactNode) | ReactNode;
    /** A unique identifier for the component. */
    id?: string;
}

/**
 * FullscreenAction provides a trigger to open content in a fullscreen takeover dialog.
 * It is commonly used for immersive editing or viewing experiences.
 */
export const FullscreenAction = ({ children, title, actionButton, id }: FullscreenActionProps) => {
    const containerRef = useRef<DOMRefValue<HTMLElement>>(null);

    return (
        <DialogTrigger type="fullscreenTakeover">
            <TooltipTrigger placement="bottom">
                <ActionButton
                    isQuiet
                    id={`${id}-open-fullscreen`}
                    aria-label={typeof title === 'string' ? `Open in fullscreen ${title}` : 'Open in fullscreen'}
                >
                    <FullScreen />
                </ActionButton>
                <Tooltip>Fullscreen</Tooltip>
            </TooltipTrigger>

            {(close) => (
                <Dialog aria-label={typeof title === 'string' ? `${title} fullscreen` : 'Fullscreen content'}>
                    <Heading>{title}</Heading>

                    <Divider />

                    <ButtonGroup>
                        {typeof actionButton === 'function' ? actionButton(containerRef.current) : actionButton}

                        <TooltipTrigger placement="bottom">
                            <ActionButton isQuiet onPress={close} aria-label="Close fullscreen">
                                <FullScreenExit />
                            </ActionButton>
                            <Tooltip>Close fullscreen</Tooltip>
                        </TooltipTrigger>
                    </ButtonGroup>

                    <Content ref={containerRef}>{children}</Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
