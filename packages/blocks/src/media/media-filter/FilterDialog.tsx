import { useEffect, useMemo, useRef } from 'react';
import { ActionButton, ButtonGroup, Content, Dialog, Flex, Heading, Icon, Text, View } from '@geti-ui/ui';
import { Add } from '@geti-ui/ui/icons';
import { FilterRow } from './FilterRow';
import { useFilterRulesDraft } from './useFilterRulesDraft';
import { DEFAULT_FILTER_CONDITION, createEmptyRule, getValidRules } from './utils';
import type { FilterDialogProps, FilterModel } from './types';

import classes from './FilterDialog.module.css';

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
        <Dialog width="780px" aria-label={dialogTitle} UNSAFE_className={classes.dialog}>
            <Heading
                UNSAFE_className={classes.filterPanelHeader}
                marginBottom={effectiveDraft.rules.length > 0 ? 'size-350' : 0}
            >
                <Text>{dialogTitle}</Text>

                {effectiveDraft.rules.length > 0 ? (
                    <Flex alignItems="center">
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
                                <Flex
                                    alignItems="center"
                                    gap={isFetchingMatches ? 'size-100' : undefined}
                                    justifyContent="center"
                                >
                                    <Text UNSAFE_className={classes.filterPanelMatches}>
                                        {isFetchingMatches
                                            ? 'Calculating matches...'
                                            : `${totalMatches} match${totalMatches === 1 ? '' : 'es'}`}
                                    </Text>
                                </Flex>
                            </View>
                        ) : null}

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
            </Heading>

            {effectiveDraft.rules.length > 0 && (
                <Content>
                    <div role="list" aria-label="Filter rules">
                        {effectiveDraft.rules.map((rule) => {
                            if (renderRow) {
                                return (
                                    <div key={rule.id} role="listitem" className={classes.rowBody}>
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
                                <div key={rule.id} role="listitem" className={classes.rowBody}>
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
                    </div>
                </Content>
            )}

            <ButtonGroup UNSAFE_className={classes.dialogFooter}>
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
                    <Icon size="S" UNSAFE_className={classes.addIcon}>
                        <Add />
                    </Icon>
                    <Text>New filter</Text>
                </ActionButton>
            </ButtonGroup>
        </Dialog>
    );
}
