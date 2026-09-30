import * as React from 'react';
import { Settings, subscribeSettings } from './Settings';

const snapshot = () => ({ modules: { ...Settings.modules }, language: Settings.language });

export function useModuleSettings() {
  const [settings, setCurrent] = React.useState(snapshot);
  React.useEffect(() => {
    const update = () => setCurrent(snapshot());
    const unsubscribe = subscribeSettings(update);
    update();
    return unsubscribe;
  }, []);
  return settings;
}
