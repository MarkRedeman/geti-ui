import { isValidElement, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { ActionButton, Content, Dialog, DialogTrigger, Flex, Heading, Text, View } from '@geti-ai/ui';
import { Add } from '@geti-ai/ui/icons';
import { FilterRow } from './FilterRow';
import { useFilterRulesDraft } from './useFilterRulesDraft';
import { DEFAULT_FILTER_CONDITION, createEmptyRule, getValidRules } from './utils';
import type { FilterDialogProps, FilterModel } from './types';

const DEFAULT_DIALOG_TITLE = 'Show results matching all of the following criteria';

function createDefaultModel(): FilterModel {
    return {
        condition: DEFAULT_FILTER_CONDITION,
        rules: [],
    };
}

function createRuleId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function FilterDialog({
    fields,
    globalOperators = [],
    draft,
    onDraftChange,
    defaultDraft,
    isOpen,
    defaultOpen,
    onOpenChange,
    onApply,
    onCancel,
    renderRow,
    renderValueEditor,
    totalMatches,
    isFetchingMatches,
    isDisabled,
    trigger,
    id,
    dialogTitle = DEFAULT_DIALOG_TITLE,
    minRuleCount = 1,
    trailingContentContainerStyle,
}: FilterDialogProps) {
    const internalInitial = defaultDraft ?? createDefaultModel();
    const isDraftControlled = draft !== undefined && onDraftChange !== undefined;

    const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
    const effectiveOpen = isOpen ?? internalOpen;

    const draftController = useFilterRulesDraft({
        initial: isDraftControlled ? draft : internalInitial,
        onCreate: () => createEmptyRule(createRuleId()),
    });

    const effectiveDraft = isDraftControlled ? draft : draftController.draft;
    const setDraft = isDraftControlled ? onDraftChange : draftController.setDraft;

    const lastAppliedFingerprint = useRef('');
    const validRules = useMemo(() => getValidRules(effectiveDraft), [effectiveDraft]);

    useEffect(() => {
        const nextModel: FilterModel = {
            condition: effectiveDraft.condition ?? DEFAULT_FILTER_CONDITION,
            rules: validRules,
        };

        const nextFingerprint = JSON.stringify(nextModel);
        if (nextFingerprint === lastAppliedFingerprint.current) {
            return;
        }

        lastAppliedFingerprint.current = nextFingerprint;
        onApply(nextModel);
    }, [effectiveDraft.condition, validRules, onApply]);

    const ensureMinimumRule = () => {
        if (effectiveDraft.rules.length >= minRuleCount) {
            return;
        }

        const toAdd = minRuleCount - effectiveDraft.rules.length;
        let next = effectiveDraft;
        for (let index = 0; index < toAdd; index += 1) {
            next = {
                ...next,
                rules: [...next.rules, createEmptyRule(createRuleId())],
            };
        }
        setDraft(next);
    };

    useEffect(() => {
        if (effectiveOpen) {
            ensureMinimumRule();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveOpen]);

    const handleOpenChange = (nextOpen: boolean) => {
        if (isOpen === undefined) {
            setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);

        if (!nextOpen) {
            onCancel?.();
        }
    };

    const handleRowChange = (ruleId: string, nextRule: FilterModel['rules'][number]) => {
        setDraft({
            ...effectiveDraft,
            rules: effectiveDraft.rules.map((rule) => (rule.id === ruleId ? nextRule : rule)),
        });
    };

    const handleRowRemove = (ruleId: string) => {
        setDraft({
            ...effectiveDraft,
            rules: effectiveDraft.rules.filter((rule) => rule.id !== ruleId),
        });
    };

    const defaultTrigger = <ActionButton isQuiet aria-label="Open filter dialog">Filter</ActionButton>;
    const resolvedTrigger = isValidElement(trigger) ? trigger : defaultTrigger;

    return (
        <DialogTrigger type="popover" onOpenChange={handleOpenChange} isOpen={effectiveOpen}>
            {resolvedTrigger as ReactElement}
            <Dialog width="60rem" aria-label={dialogTitle}>
                <Heading>{dialogTitle}</Heading>

                {totalMatches !== undefined ? (
                    <View marginBottom="size-200">
                        <Text>{isFetchingMatches ? 'Calculating matches...' : `${totalMatches} matches`}</Text>
                    </View>
                ) : null}

                <Content>
                    <Flex direction="column" gap="size-150">
                        {effectiveDraft.rules.map((rule) => {
                            if (renderRow) {
                                return (
                                    <div key={rule.id}>
                                        {renderRow({
                                            rule,
                                            fields,
                                            operators: globalOperators,
                                            onChange: (nextRule) => handleRowChange(rule.id, nextRule),
                                            onRemove: () => handleRowRemove(rule.id),
                                            renderValueEditor,
                                        })}
                                    </div>
                                );
                            }

                            return (
                                <FilterRow
                                    key={rule.id}
                                    rule={rule}
                                    fields={fields}
                                    globalOperators={globalOperators}
                                    onChange={(nextRule) => handleRowChange(rule.id, nextRule)}
                                    onRemove={() => handleRowRemove(rule.id)}
                                    renderValueEditor={renderValueEditor}
                                    isDisabled={isDisabled}
                                />
                            );
                        })}
                    </Flex>
                </Content>

                <div style={trailingContentContainerStyle}>
                    <Flex direction="row" alignItems="center" marginTop="size-200">
                        <ActionButton
                            isQuiet
                            id={id ? `${id}-new-filter` : undefined}
                            isDisabled={isDisabled}
                            onPress={() => {
                                setDraft({
                                    ...effectiveDraft,
                                    rules: [...effectiveDraft.rules, createEmptyRule(createRuleId())],
                                });
                            }}
                        >
                            <Add />
                            <Text>New filter</Text>
                        </ActionButton>
                    </Flex>
                </div>
            </Dialog>
        </DialogTrigger>
    );
}
