declare module '*.webp' {
    const src: string;
    export default src;
}

// ---------------------------------------------------------------------------
// @spectrum-icons/workflow — exhaustive module declarations
//
// Each icon is its own deep-import (e.g. `@spectrum-icons/workflow/Delete`).
// By listing every valid icon name explicitly instead of using a wildcard,
// TypeScript will raise an error if you try to import a name that does not
// exist in the installed package (e.g. the removed `Upload` icon).
//
// IMPORTANT: This file must remain ambient (no top-level import/export
// statements). Inline import() types are used inside each declaration block.
//
// Regenerate this list when upgrading @spectrum-icons/workflow:
//   ls node_modules/@spectrum-icons/workflow/*.js \
//     | sed 's|.*/||; s|\.js$||' \
//     | grep -v '^index$' \
//     | sort \
//     | awk '{print "declare module '"'"'@spectrum-icons/workflow/"$1"'"'"' { import { JSX } from '"'"'react'"'"'; const Icon: (props: import('"'"'@react-spectrum/icon'"'"').IconPropsWithoutChildren) => JSX.Element; export default Icon; }"}'
// ---------------------------------------------------------------------------

declare module '@spectrum-icons/workflow/123' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/3DMaterials' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ABC' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Actions' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Add' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AddCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AdDisplay' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AddTo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AddToSelection' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AdPrint' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AEMScreens' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Airplane' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Alert' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlertAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlertCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlertCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlertCircleFilled' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Algorithm' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Alias' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlignBottom' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlignCenter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlignLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlignMiddle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlignRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AlignTop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Amusementpark' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Anchor' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AnchorSelect' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Annotate' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AnnotatePen' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Answer' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AnswerFavorite' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/App' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AppleFiles' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ApplicationDelivery' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AppRefresh' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ApproveReject' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Apps' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Archive' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ArchiveRemove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ArrowDown' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ArrowLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ArrowRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ArrowUp' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ArrowUpRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Artboard' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Article' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Asset' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AssetCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AssetsAdded' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AssetsDownloaded' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AssetsExpired' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AssetsLinkedPublished' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AssetsModified' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AssetsPublished' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Asterisk' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/At' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Attach' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AttachmentExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Attributes' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Audio' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/AutomatedSegment' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Back' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Back30Seconds' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BackAndroid' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Beaker' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BeakerCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BeakerShare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Bell' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BidRule' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BidRuleAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Blower' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Blur' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Book' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Bookmark' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BookmarkSingle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BookmarkSingleOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BookmarkSmall' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BookmarkSmallOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Boolean' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Border' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Box' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BoxAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BoxExport' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BoxImport' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Brackets' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BracketsSquare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Branch1' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Branch2' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Branch3' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BranchCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BreadcrumbNavigation' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Breakdown' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BreakdownAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Briefcase' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Browse' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Brush' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Bug' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Building' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/BulkEditUsers' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Button' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Calculator' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Calendar' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CalendarAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CalendarLocked' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CalendarUnlocked' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CallCenter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Camera' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CameraFlip' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CameraRefresh' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Campaign' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CampaignAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CampaignClose' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CampaignDelete' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CampaignEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Cancel' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Capitals' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Captcha' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Car' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Card' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CCLibrary' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Channel' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Chat' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ChatAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Checkmark' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CheckmarkCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CheckmarkCircleOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CheckPause' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ChevronDoubleLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ChevronDoubleRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ChevronDown' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ChevronLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ChevronRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ChevronUp' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ChevronUpDown' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Circle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CircleFilled' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ClassicGridView' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Clock' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ClockCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CloneStamp' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Close' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CloseCaptions' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CloseCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Cloud' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CloudDisconnected' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CloudError' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CloudOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Code' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Collection' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CollectionAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CollectionAddTo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CollectionCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CollectionEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CollectionExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CollectionLink' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ColorFill' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ColorPalette' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ColorWheel' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ColumnSettings' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ColumnTwoA' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ColumnTwoB' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ColumnTwoC' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Comment' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Compare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Compass' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Condition' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ConfidenceFour' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ConfidenceOne' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ConfidenceThree' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ConfidenceTwo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Contrast' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ConversionFunnel' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Copy' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CoverImage' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CreditCard' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Crop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CropLightning' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/CropRotate' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Crosshairs' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Curate' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Cut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Dashboard' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Data' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataBook' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataCorrelated' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataDownload' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataMapping' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataRefresh' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataRemove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataSettings' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataUnavailable' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataUpload' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DataUser' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Date' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DateInput' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Deduplication' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Delegate' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Delete' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DeleteOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Demographic' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Deselect' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DeselectCircular' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DesktopAndMobile' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DeviceDesktop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DeviceLaptop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DevicePhone' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DevicePhoneRefresh' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DevicePreview' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DeviceRotateLandscape' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DeviceRotatePortrait' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Devices' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DeviceTablet' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DeviceTV' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeBottomEdge' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeHorizontalCenter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeHorizontally' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeLeftEdge' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeRightEdge' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeSpaceHoriz' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeSpaceVert' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeTopEdge' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeVerticalCenter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DistributeVertically' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Divide' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DividePath' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Document' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DocumentFragment' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DocumentFragmentGroup' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DocumentOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DocumentRefresh' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Dolly' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Download' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DownloadFromCloud' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DownloadFromCloudOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Draft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/DragHandle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Draw' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Dropdown' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Duplicate' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Edit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EditCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EditExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EditIn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EditInLight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Education' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Effects' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Efficient' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Ellipse' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Email' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailCancel' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailExcludeOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailGear' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailGearOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailKey' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailKeyOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailLightning' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailNotification' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailRefresh' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EmailSchedule' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Engagement' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Erase' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Event' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EventExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Events' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/EventShare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ExcludeOverlap' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Experience' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ExperienceAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ExperienceAddTo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ExperienceExport' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ExperienceImport' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Export' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ExportOriginal' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Exposure' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Extension' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FacebookCoverImage' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Fast' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FastForward' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FastForwardCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Feature' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Feed' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FeedAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Feedback' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FeedManagement' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileCampaign' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileChart' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileCheckedOut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileCode' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileCSV' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileData' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileEmail' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileExcel' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileFolder' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileGear' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileGlobe' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileHTML' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileImportant' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileJson' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileKey' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileMobile' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilePDF' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileShare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileSingleWebPage' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileSpace' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileTemplate' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileTxt' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileUser' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileWord' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileWorkflow' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileXML' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FileZip' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilingCabinet' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Filmroll' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilmrollAutoAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Filter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilterAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilterCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilterDelete' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilterEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilterHeart' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilterRemove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FilterStar' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FindAndReplace' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Flag' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FlagExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FlashAuto' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Flashlight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FlashlightOff' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FlashlightOn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FlashOff' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FlashOn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FlipHorizontal' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FlipVertical' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Folder' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Folder2Color' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderAddTo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderArchive' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderDelete' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderGear' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderLocked' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderOpen' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderOpenOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderRemove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderSearch' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FolderUser' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Follow' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FollowOff' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Forecast' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Form' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ForPlacementOnly' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Forward' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FullScreen' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/FullScreenExit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Function' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Game' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Gauge1' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Gauge2' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Gauge3' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Gauge4' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Gauge5' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Gears' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GearsAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GearsDelete' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GearsEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GenderFemale' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GenderMale' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Gift' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Globe' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeClock' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeEnter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeExit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeGrid' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeRemove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeSearch' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeStrike' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GlobeStrikeClock' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Gradient' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphArea' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphAreaStacked' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphBarHorizontal' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphBarHorizontalAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphBarHorizontalStacked' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphBarVertical' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphBarVerticalAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphBarVerticalStacked' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphBubble' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphBullet' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphConfidenceBands' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphDonut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphDonutAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphGantt' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphHistogram' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Graphic' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphPathing' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphPie' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphProfitCurve' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphScatter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphStream' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphStreamRanked' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphStreamRankedAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphSunburst' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphTree' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphTrend' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphTrendAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/GraphTrendAlert' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Group' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Hammer' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Hand' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Hand0' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Hand1' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Hand2' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Hand3' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Hand4' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Heal' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Heart' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Help' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/HelpOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Histogram' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/History' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Home' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Homepage' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/HotelBed' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/HotFixes' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/IdentityService' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Image' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageAlbum' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageAutoMode' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageCarousel' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageCheckedOut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageMapCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageMapPolygon' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageMapRectangle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageNext' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageProfile' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Images' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageSearch' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ImageText' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Import' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Inbox' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Individual' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Info' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/InfoOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/IntersectOverlap' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/InvertAdj' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Invite' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Journey' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/JourneyAction' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/JourneyData' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/JourneyEvent' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/JourneyEvent2' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/JourneyReports' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/JourneyVoyager' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/JumpToTop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Key' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Keyboard' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/KeyClock' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/KeyExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Label' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LabelExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Labels' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Landscape' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Launch' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Layers' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LayersBackward' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LayersBringToFront' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LayersForward' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LayersSendToBack' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Light' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Line' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinearGradient' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LineHeight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Link' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinkCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinkGlobe' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinkNav' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinkOff' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinkOut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinkOutLight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinkPage' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LinkUser' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Location' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LocationBasedDate' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LocationBasedEvent' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LocationContribution' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LockClosed' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LockOpen' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Login' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LogOut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Looks' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/LoupeView' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MagicWand' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Magnify' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Mailbox' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MapView' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MarginBottom' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MarginLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MarginRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MarginTop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MarketingActivities' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Maximize' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MBox' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Measure' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Menu' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Merge' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MergeLayers' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Messenger' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Minimize' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MobileServices' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ModernGridView' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Money' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Monitoring' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Moon' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/More' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MoreCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MoreSmall' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MoreSmallList' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MoreSmallListVert' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MoreVertical' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Move' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MoveLeftRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MoveTo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MoveUpDown' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MovieCamera' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Multiple' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MultipleAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MultipleCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/MultipleExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/NamingOrder' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/NewItem' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/News' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/NewsAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/NoEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Note' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/NoteAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Offer' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/OfferDelete' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/OnAir' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/OpenIn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/OpenInLight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/OpenRecent' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/OpenRecentOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Orbit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Organisations' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Organize' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/OS' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/OutlinePath' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PaddingBottom' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PaddingLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PaddingRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PaddingTop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PageBreak' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PageExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PageGear' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PageRule' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PagesExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PageShare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PageTag' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Pan' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Panel' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Paste' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PasteHTML' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PasteList' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PasteText' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Pattern' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Pause' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PauseCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Pawn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Pending' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PeopleGroup' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PersonalizationField' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Perspective' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PinOff' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PinOn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Pivot' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PlatformDataMapping' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Play' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PlayCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Plug' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Polygon' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PolygonSelect' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PopIn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Portrait' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Preset' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Preview' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Print' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PrintPreview' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Project' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ProjectAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ProjectEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ProjectNameEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Promote' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Properties' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PropertiesCopy' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PublishCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PublishPending' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PublishReject' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PublishRemove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PublishSchedule' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/PushNotification' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Question' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/QuickSelect' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RadialGradient' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Rail' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RailBottom' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RailLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RailRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RailRightClose' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RailRightOpen' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RailTop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RangeMask' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RealTimeCustomerProfile' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Rectangle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RectSelect' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Redo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Refresh' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RegionSelect' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Relevance' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Remove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RemoveCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Rename' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Reorder' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Replay' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Replies' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Reply' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ReplyAll' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Report' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ReportAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Resize' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Retweet' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Reuse' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Revenue' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Revert' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Rewind' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RewindCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Ribbon' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RotateCCW' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RotateCCWBold' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RotateCW' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RotateCWBold' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RotateLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RotateLeftOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RotateRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RotateRightOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/RSS' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Sampler' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Sandbox' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SaveAsFloppy' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SaveFloppy' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SaveTo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SaveToLight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Scribble' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Search' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Seat' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SeatAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Segmentation' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Segments' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Select' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectBox' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectBoxAll' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectCircular' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectContainer' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectGear' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectIntersect' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Selection' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectionChecked' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectionMove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SelectSubtract' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Send' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SentimentNegative' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SentimentNeutral' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SentimentPositive' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Separator' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Servers' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Settings' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Shapes' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Share' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ShareAndroid' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ShareCheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ShareLight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ShareWindows' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Sharpen' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Shield' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Ship' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Shop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ShoppingCart' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ShowAllLayers' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ShowMenu' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ShowOneLayer' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Shuffle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Slice' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Slow' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SmallCaps' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SMS' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SMSKey' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SMSLightning' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SMSRefresh' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Snapshot' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SocialNetwork' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SortOrderDown' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SortOrderUp' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Spam' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Spellcheck' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Spin' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SplitView' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SpotHeal' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SQLQuery' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Stadium' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Stage' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Stamp' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Star' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Starburst' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/StarOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/StepBackward' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/StepBackwardCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/StepForward' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/StepForwardCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Stop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/StopCircle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Stopwatch' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Straighten' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/StraightenOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/StrokeWidth' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Subscribe' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SubtractBackPath' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SubtractFromSelection' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SubtractFrontPath' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SuccessMetric' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Summarize' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Survey' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Switch' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Sync' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/SyncRemove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Table' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableAndChart' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableColumnAddLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableColumnAddRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableColumnMerge' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableColumnRemoveCenter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableColumnSplit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableHistogram' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableMergeCells' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableRowAddBottom' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableRowAddTop' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableRowMerge' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableRowRemoveCenter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableRowSplit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableSelectColumn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TableSelectRow' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TagBold' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TagItalic' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TagUnderline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Target' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Targeted' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TaskList' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Teapot' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Temperature' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TestAB' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TestABEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TestABGear' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TestABRemove' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TestProfile' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Text' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextAlignCenter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextAlignJustify' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextAlignLeft' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextAlignRight' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextBaselineShift' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextBold' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextBulleted' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextBulletedAttach' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextBulletedHierarchy' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextBulletedHierarchyExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextColor' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextDecrease' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextIncrease' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextIndentDecrease' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextIndentIncrease' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextItalic' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextKerning' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextLetteredLowerCase' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextLetteredUpperCase' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextNumbered' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextParagraph' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextRomanLowercase' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextRomanUppercase' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextSize' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextSizeAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextSpaceAfter' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextSpaceBefore' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextStrikethrough' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextStroke' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextStyle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextSubscript' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextSuperscript' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextTracking' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TextUnderline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ThumbDown' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ThumbDownOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ThumbUp' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ThumbUpOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Tips' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Train' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TransferToPlatform' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Transparency' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Trap' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TreeCollapse' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TreeCollapseAll' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TreeExpand' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TreeExpandAll' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TrendInspect' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/TrimPath' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Trophy' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Type' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Underline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Undo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Ungroup' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Unlink' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Unmerge' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UploadToCloud' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UploadToCloudOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/USA' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/User' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserActivity' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserAdmin' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserArrow' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserCheckedOut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserDeveloper' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserEdit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserGroup' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserLock' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UsersAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UsersExclude' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UserShare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UsersLock' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/UsersShare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Variable' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VectorDraw' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VideoCheckedOut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VideoFilled' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VideoOutline' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewAllTags' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewBiWeek' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewCard' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewColumn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewDay' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewDetail' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewedMarkAs' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewGrid' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewList' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewRow' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewSingle' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewStack' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ViewWeek' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Vignette' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Visibility' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VisibilityOff' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Visit' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VisitShare' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VoiceOver' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VolumeMute' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VolumeOne' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VolumeThree' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/VolumeTwo' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Watch' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/WebPage' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/WebPages' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Workflow' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/WorkflowAdd' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/Wrench' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ZoomIn' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
declare module '@spectrum-icons/workflow/ZoomOut' {
    const Icon: (props: import('@react-spectrum/icon').IconPropsWithoutChildren) => import('react').JSX.Element;
    export default Icon;
}
