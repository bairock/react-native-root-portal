import React, { useEffect, useState, useMemo } from 'react';
import wrapRootComponent from 'react-native-root-siblings/lib/wrapRootComponent';
import ChildrenWrapper from 'react-native-root-siblings/lib/ChildrenWrapper';
const portalManagers = new Map();
let portalUuid = 0;
function createPortalId(id) {
    return `portal:${id}`;
}
export function isPortalExisted(name) {
    return portalManagers.has(name);
}
export function enterPortal(unique, target, guest, callback) {
    const manager = portalManagers.get(target);
    const id = createPortalId(unique);
    if (manager) {
        manager.update(id, guest, callback);
    }
    else {
        throw new Error(`react-native-root-portal: Can not find target PortalExit named:'${target}'.`);
    }
    return {
        update: (updater, updateCallback) => {
            manager.update(id, updater, updateCallback);
        },
        destroy: (destroyCallback) => {
            manager.destroy(id, destroyCallback);
        }
    };
}
export function PortalEntry(props) {
    const { children, target } = props;
    const manager = target ? portalManagers.get(target) : null;
    const [id] = useState(() => ++portalUuid);
    useEffect(() => {
        if (manager) {
            return () => manager.destroy(createPortalId(id));
        }
    }, [manager]);
    if (manager) {
        manager.update(createPortalId(id), <>{children}</>);
    }
    else if (target) {
        console.error(`react-native-root-portal: Can not find target PortalExit named:'${target}'.`);
    }
    else {
        return <>{children}</>;
    }
    return null;
}
export function PortalExit(props) {
    const { name, renderSibling, children } = props;
    const sibling = useMemo(() => {
        const { Root, manager } = wrapRootComponent(ChildrenWrapper, renderSibling);
        if (isPortalExisted(name)) {
            console.warn(`react-native-root-portal: Another PortalExit named:'${name}' is already existed.`);
        }
        portalManagers.set(name, manager);
        return {
            Root,
            manager
        };
    }, []);
    useEffect(() => {
        if (!portalManagers.has(name)) {
            portalManagers.set(name, sibling.manager);
        }
        return () => {
            portalManagers.delete(name);
        };
    }, [name]);
    const { Root } = sibling;
    return (<>
        {children}
        <Root />
    </>);
}
export default {
    Entry: PortalEntry,
    Exit: PortalExit,
    isExisted: isPortalExisted,
    enter: enterPortal
};
//# sourceMappingURL=index.js.map