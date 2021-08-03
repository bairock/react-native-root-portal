import React, { ReactNode } from 'react';
export declare function isPortalExisted(name: string): boolean;
export interface PortalManager {
    update: (updater: React.ReactNode, updateCallback?: (() => void) | undefined) => void;
    destroy: (destroyCallback?: () => void) => void;
}
export declare function enterPortal(unique: string, target: string, guest: ReactNode, callback?: () => void): PortalManager;
export declare function PortalEntry(props: {
    children: ReactNode;
    target?: string;
}): JSX.Element | null;
export declare function PortalExit(props: {
    name: string;
    renderSibling?: (sibling: ReactNode) => ReactNode;
    children?: ReactNode;
}): JSX.Element;
declare const _default: {
    Entry: typeof PortalEntry;
    Exit: typeof PortalExit;
    isExisted: typeof isPortalExisted;
    enter: typeof enterPortal;
};
export default _default;
