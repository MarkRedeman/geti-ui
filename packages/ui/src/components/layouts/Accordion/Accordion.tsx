import { Accordion as SpectrumAccordion, SpectrumAccordionProps } from '@adobe/react-spectrum';

/**
 * Props for the Accordion component.
 * Extends Spectrum's SpectrumAccordionProps.
 */
export interface AccordionProps extends SpectrumAccordionProps {}

/**
 * A group of disclosures that wraps Adobe React Spectrum's Accordion.
 * Each disclosure can be expanded and collapsed independently or exclusively,
 * depending on `allowsMultipleExpanded`.
 */
export const Accordion = (props: AccordionProps) => <SpectrumAccordion {...props} />;
