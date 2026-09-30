import * as React from 'react';
import {
  Flex,
  Block,
  Circle,
  Paragraph,
  BlipAccordion,
  HorizontalStack,
  BlipAccordionBody,
  BlipAccordionItem,
  BlipAccordionHeader,
  BlipAccordionButton,
  Switch,
} from '@components';

import { PaletteColor, Tag } from '~/types';
import { createToast } from '~/Utils';
import { setSettings, Settings } from '~/Settings';
import { BdsButton, BdsTypo } from 'blip-ds/dist/blip-ds-react';
import { ColorPalette } from '@features/AutoTag/ColorPalette';
import { DEFAULT_TAGS } from '@features/AutoTag/Constants';
import { t } from 'src/i18n';

export const TagsConfig = (): JSX.Element => {
  const [tagsSettings, setTagsSettings] = React.useState(Settings.personalTags);
  const [isAutoTagActive, setIsAutoTagActive] = React.useState(
    Settings.isAutoTagActive
  );

  React.useEffect(() => {
    chrome.storage.sync.get('settings', ({ settings = Settings }) => {
      setTagsSettings(settings.personalTags || []);
    });
  }, []);

  const updateSettings = (): void => {
    setSettings({
      personalTags: tagsSettings,
    });

    createToast({
      toastText: t('toastContainer.tagConfig.toast.toastTextUpdated'),
      toastTitle: t('toastContainer.tagConfig.toast.toastTitleUpdated'),
      variant: 'success',
      duration: 2,
    });
  };

  const updateIsAutoTagActive = (): void => {
    setSettings({ isAutoTagActive: !isAutoTagActive });
    setIsAutoTagActive(!isAutoTagActive);
  };

  const setDefaultTags = (): void => {
    setTagsSettings([...DEFAULT_TAGS]);

    setSettings({
      personalTags: DEFAULT_TAGS,
    });

    createToast({
      toastText: t('toastContainer.tagConfig.toast.toastTextRestored'),
      toastTitle: t('toastContainer.tagConfig.toast.toastTitleRestored'),
      variant: 'success',
      duration: 2,
    });
  };

  const onColorChange = (color: PaletteColor, index: string): void => {
    tagsSettings[index].color = color.hex;
    setTagsSettings([...tagsSettings]);
  };

  const onTagActiveChange = (index: number): void => {
    tagsSettings[index].isActive = !tagsSettings[index].isActive;
    setTagsSettings([...tagsSettings]);
  };

  const getAccorionItems = (tagsSettings: Tag[]): JSX.Element[] => {
    const defaultTagsMapped = tagsSettings.map((tag: Tag, index: number) => {
      return (
        <BlipAccordionItem borderTop={0} key={tag.name}>
          <BlipAccordionHeader>
            <Flex className="justify-between" alignItems="center">
              <BlipAccordionButton title={tag.name} />
              <Circle width={20} height={20} backgroundColor={tag.color} />
            </Flex>
          </BlipAccordionHeader>
          <BlipAccordionBody>
            <ColorPalette
              id={index.toString()}
              onColorChange={onColorChange}
              defaultColor={tag.color}
            />
            <HorizontalStack marginTop={2}>
              <Switch
                isChecked={tag.isActive}
                name="overwrite"
                onChange={() => onTagActiveChange(index)}
                size="short"
              />
              <Paragraph>{t('toastContainer.tagConfig.switch1')} {tag.name}.</Paragraph>
            </HorizontalStack>
          </BlipAccordionBody>
        </BlipAccordionItem>
      );
    });

    return defaultTagsMapped;
  };

  return (
    <Block padding={0}>
      <Paragraph>{t('toastContainer.tagConfig.text1')}</Paragraph>

      <Flex marginTop={2}>
        <Switch
          isChecked={isAutoTagActive}
          name="overwrite"
          onChange={updateIsAutoTagActive}
        />
        <Block marginLeft={1}>
          <BdsTypo bold="regular" variant="fs-14">
            {t('toastContainer.tagConfig.switch1')}
          </BdsTypo>
        </Block>
      </Flex>

      <Block marginTop={2} marginBottom={2}>
        <Block width="100%">
          <BlipAccordion>{getAccorionItems(tagsSettings)}</BlipAccordion>
        </Block>

        <HorizontalStack marginTop={2}>
          <BdsButton variant="delete" onClick={setDefaultTags}>
            {t('toastContainer.tagConfig.restoreButton')}
          </BdsButton>
          <BdsButton type="submit" variant="primary" onClick={updateSettings}>
            {t('toastContainer.tagConfig.saveButton')}
          </BdsButton>
        </HorizontalStack>
      </Block>
    </Block>
  );
};
