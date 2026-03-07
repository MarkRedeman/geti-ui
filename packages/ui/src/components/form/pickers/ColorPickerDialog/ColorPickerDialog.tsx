import {
    ColorArea,
    ColorField,
    ColorSlider,
    ColorSwatch,
    ColorSwatchPicker,
    ColorWheel,
    parseColor,
    ActionButton,
    Button,
    Dialog,
    DialogTrigger,
    Heading,
    Content,
    ButtonGroup,
    Divider,
    Flex,
    Color,
} from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';

export interface ColorPickerDialogProps {
    /** The current color value. */
    color?: string;
    /** Callback called when the color changes. */
    onColorChange?: (color: string) => void;
    /** The label for the dialog trigger button. */
    label?: string;
    /** Whether the dialog is open (controlled). */
    isOpen?: boolean;
    /** Callback called when the open state changes. */
    onOpenChange?: (isOpen: boolean) => void;
}

/**
 * A ColorPickerDialog provides a comprehensive UI for picking colors.
 * It combines ColorArea, ColorSlider, ColorWheel, and ColorField into a single dialog.
 */
export const ColorPickerDialog = ({
    color: colorProp,
    onColorChange,
    label = 'Pick Color',
    ...rest
}: ColorPickerDialogProps) => {
    const [color, setColor] = useState<Color>(() => (colorProp ? parseColor(colorProp) : parseColor('#ff0000')));

    useEffect(() => {
        if (colorProp) {
            setColor(parseColor(colorProp));
        }
    }, [colorProp]);

    const handleConfirm = (close: () => void) => {
        onColorChange?.(color.toString('hex'));
        close();
    };

    return (
        <DialogTrigger {...rest}>
            <ActionButton aria-label={label}>
                <Flex gap="size-100" alignItems="center">
                    <ColorSwatch color={color} size="S" />
                    <span aria-hidden="true">{label}</span>
                </Flex>
            </ActionButton>
            {(close) => (
                <Dialog size="M">
                    <Heading>Color Picker</Heading>
                    <Divider />
                    <Content>
                        <Flex direction="column" gap="size-200">
                            <Flex gap="size-300">
                                <Flex direction="column" gap="size-150">
                                    <ColorArea
                                        value={color}
                                        onChange={(c) => c && setColor(c)}
                                        xChannel="saturation"
                                        yChannel="brightness"
                                    />
                                    <ColorSlider value={color} onChange={(c) => c && setColor(c)} channel="hue" />
                                    <ColorSlider value={color} onChange={(c) => c && setColor(c)} channel="alpha" />
                                </Flex>
                                <Flex direction="column" gap="size-150" alignItems="center">
                                    <ColorWheel value={color} onChange={(c) => c && setColor(c)} />
                                    <ColorField label="Hex" value={color} onChange={(c) => c && setColor(c)} />
                                </Flex>
                            </Flex>

                            <Flex direction="column" gap="size-100">
                                <Heading level={4}>Presets</Heading>
                                <ColorSwatchPicker value={color} onChange={(c) => c && setColor(c)}>
                                    <ColorSwatch color="#ff0000" />
                                    <ColorSwatch color="#00ff00" />
                                    <ColorSwatch color="#0000ff" />
                                    <ColorSwatch color="#ffff00" />
                                    <ColorSwatch color="#ff00ff" />
                                    <ColorSwatch color="#00ffff" />
                                    <ColorSwatch color="#ffffff" />
                                    <ColorSwatch color="#000000" />
                                </ColorSwatchPicker>
                            </Flex>
                        </Flex>
                    </Content>
                    <ButtonGroup>
                        <Button variant="secondary" onPress={close}>
                            Cancel
                        </Button>
                        <Button variant="accent" onPress={() => handleConfirm(close)}>
                            Confirm
                        </Button>
                    </ButtonGroup>
                </Dialog>
            )}
        </DialogTrigger>
    );
};
