import { useEffect, useMemo, useRef } from 'react';
import { ActionButton, Content, Dialog, Flex, Heading, Text, View, ButtonGroup } from '@geti-ai/ui';
import { Icon } from '@adobe/react-spectrum';
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

function createEmptyRules(count: number) {
    return Array.from({ length: Math.max(0, count) }, () => createEmptyRule(createRuleId()));
}

export function FilterDialog({
    fields,
    globalOperators = [],
    draft,
    onDraftChange,
    defaultDraft,
    onApply,
    renderRow,
    renderValueEditor,
    totalMatches,
    isFetchingMatches,
    isDisabled,
    dialogTitle = DEFAULT_DIALOG_TITLE,
    minRuleCount = 1,
    trailingContentContainerStyle,
}: FilterDialogProps) {
    const internalInitial = defaultDraft ?? createDefaultModel();
    const isDraftControlled = draft !== undefined && onDraftChange !== undefined;

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

        setDraft({
            ...effectiveDraft,
            rules: [...effectiveDraft.rules, ...createEmptyRules(minRuleCount - effectiveDraft.rules.length)],
        });
    };

    useEffect(() => {
        ensureMinimumRule();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <Dialog width={{ base: '60rem', L: '66rem' }} aria-label={dialogTitle}>
            <Heading marginBottom={effectiveDraft.rules.length > 0 ? 'size-250' : 0}>
                <Text id="filter-dialog-title">{dialogTitle}</Text>
            </Heading>

            {effectiveDraft.rules.length > 0 ? (
                <Flex alignItems="center" justifyContent="space-between" marginBottom="size-200" gap="size-200">
                    {totalMatches !== undefined ? (
                        <View
                            paddingX="size-200"
                            paddingY="size-25"
                            backgroundColor="gray-700"
                            borderRadius="large"
                            borderWidth="thin"
                            borderColor="gray-700"
                            minWidth="size-1200"
                        >
                            <Text>
                                {isFetchingMatches
                                    ? 'Calculating matches...'
                                    : `${totalMatches} match${totalMatches === 1 ? '' : 'es'}`}
                            </Text>
                        </View>
                    ) : (
                        <View />
                    )}

                    <ActionButton
                        isQuiet
                        id="filter-dialog-clear-all"
                        onPress={() => {
                            setDraft({
                                ...effectiveDraft,
                                rules: createEmptyRules(minRuleCount),
                            });
                        }}
                    >
                        Clear all
                    </ActionButton>
                </Flex>
            ) : null}

            {effectiveDraft.rules.length > 0 && (
                <Content>
                    <div role="list" aria-label="Filter rules">
                        <Flex direction="column" gap="size-150">
                            {effectiveDraft.rules.map((rule) => {
                                if (renderRow) {
                                    return (
                                        <div key={rule.id} role="listitem">
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
                                    <div key={rule.id} role="listitem">
                                        <FilterRow
                                            rule={rule}
                                            fields={fields}
                                            globalOperators={globalOperators}
                                            onChange={(nextRule) => handleRowChange(rule.id, nextRule)}
                                            onRemove={() => handleRowRemove(rule.id)}
                                            renderValueEditor={renderValueEditor}
                                            isDisabled={isDisabled}
                                        />
                                    </div>
                                );
                            })}
                        </Flex>
                    </div>
                </Content>
            )}

            <ButtonGroup UNSAFE_style={trailingContentContainerStyle}>
                <ActionButton
                    isQuiet
                    marginEnd="auto"
                    isDisabled={isDisabled}
                    onPress={() => {
                        setDraft({
                            ...effectiveDraft,
                            rules: [...effectiveDraft.rules, createEmptyRule(createRuleId())],
                        });
                    }}
                >
                    <Icon>
                        <Add />
                    </Icon>
                    <Text>New filter</Text>
                </ActionButton>
            </ButtonGroup>
        </Dialog>
    );
}
