import { BlipAddons } from './BlipAddons';

const extension = new BlipAddons().start();

extension.onBuilderLoad(extension.runFeatures);
