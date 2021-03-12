

export const getThreadDictForKey = (key, docId) => {
    if (docId) {
      key = `${docId}_${key}`;
    }
    const threadDictionary = NSThread.mainThread().threadDictionary();
    return threadDictionary[key];
};

export const setThreadDictForKey = (key,value,docId) => {
    if (docId) {
      key = `${docId}_${key}`;
    }
    const threadDictionary = NSThread.mainThread().threadDictionary();
    threadDictionary[key] = value;
};

export const removeThreadDictForKey = (key, docId) => {
    if (docId) {
      key = `${docId}_${key}`;
    }
    const threadDictionary = NSThread.mainThread().threadDictionary();
    threadDictionary.removeObjectForKey(key);
};

export function clearPanels(document,key) {
    const threadDictionary = NSThread.mainThread().threadDictionary();
    const view = threadDictionary[key];
    if (!view) return;
    (document.splitViewController()).removeSplitViewItem(view);
    threadDictionary.removeObjectForKey(key);
}