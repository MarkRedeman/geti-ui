import { useState } from 'react';
import { Icon } from '@geti-ui/ui';
import { Copy, Checkmark } from '@geti-ui/ui/icons';

type InstallCommandProps = {
    command: string;
    variant?: 'default' | 'subtle';
    label?: string;
};

export function InstallCommand({ command, variant = 'default', label }: InstallCommandProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <div className={`geti-home-install-wrapper${variant === 'subtle' ? ' geti-home-install-wrapper--subtle' : ''}`}>
            {label && <span className="geti-home-install__label">{label}</span>}
            <button
                type="button"
                className={`geti-home-install${variant === 'subtle' ? ' geti-home-install--subtle' : ''}${
                    copied ? ' geti-home-install--copied' : ''
                }`}
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : `Copy: ${command}`}
            >
                <code className="geti-home-install__code">{command}</code>
                <span
                    className={`geti-home-install__icon${copied ? ' geti-home-install__icon--copied' : ''}`}
                    aria-hidden="true"
                >
                    {copied ? (
                        <Icon size="XS">
                            <Checkmark />
                        </Icon>
                    ) : (
                        <Icon size="XS">
                            <Copy />
                        </Icon>
                    )}
                </span>
            </button>
        </div>
    );
}
