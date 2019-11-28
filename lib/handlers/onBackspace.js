// @flow
import { type Change } from "slate";

import type Options from "../options";
import { unwrapList } from "../changes";
import { getCurrentItem, getPreviousItem } from "../utils";

/**
 * User pressed Delete in an editor
 */
function onBackspace(
    event: *,
    change: Change,
    editor: *,
    opts: Options
): void | any {
    const { value } = change;
    const { selection } = value;
    const { start, isCollapsed, isExpanded } = selection;

    // Only unwrap...
    // ... with a collapsed selection
    if (isExpanded) {
        return undefined;
    }

    // ... when at the beginning of nodes
    if (start.offset > 0) {
        return undefined;
    }
    // ... in a list
    const currentItem = getCurrentItem(opts, value);
    if (!currentItem) {
        return undefined;
    }
    // ... more precisely at the beginning of the current item
    if (!isCollapsed || !start.isAtStartOfNode(currentItem)) {
        return undefined;
    }

    let previousItem = getPreviousItem(opts, value);
    if (!previousItem) {
        previousItem = value.document.getPreviousNode(currentItem.key);
    }
    event.preventDefault();
    change = unwrapList(opts, change);
    change.deleteBackward();
    change.moveToEndOfNode(previousItem);
    return change;
}

export default onBackspace;
