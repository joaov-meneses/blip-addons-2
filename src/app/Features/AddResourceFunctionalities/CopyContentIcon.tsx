import React, { useState, useCallback } from 'react';
import { BdsIcon } from 'blip-ds/dist/blip-ds-react';
import { AddResourceFunctionalities } from '.';
import { DOM_PROPERTIES } from './Constants';
import { IconSize } from 'blip-ds/dist/types/components/icon/icon-interface';

const {
  copyIconName,
  size,
  cursor,
  marginLeft,
  genericClassIdentifier,
  checkIconName,
  timeToSeeCheckIconAfterCopy,
} = DOM_PROPERTIES.button.copy as CopyButtonProps;

interface CopyButtonProps {
  copyIconName: string;
  size: IconSize;
  cursor: string;
  marginLeft: string;
  genericClassIdentifier: string;
  checkIconName: string;
  timeToSeeCheckIconAfterCopy: number;
}

interface CopyContentIconProps {
  targetElement: HTMLElement | null;
  keyName: string;
  className: string;
  needGetContentByKey: boolean;
}

export const CopyContentIcon: React.FC<CopyContentIconProps> = ({
  targetElement,
  keyName,
  className,
  needGetContentByKey,
}) => {
  const [currentIcon, setCurrentIcon] = useState(copyIconName);

  const iconStyle = {
    cursor,
    marginLeft,
  };

  const targetElementClassWithoutInitialDot = className.replace('.', '');

  const completelyClassName = `${targetElementClassWithoutInitialDot}${genericClassIdentifier}`;

  const handleCopy = useCallback(() => {
    const contentToCopy = needGetContentByKey
      ? AddResourceFunctionalities.getContentByKeyName(targetElement, keyName)
      : keyName;

    const contentToCopyChecked = contentToCopy || 'errorToCopy';

    navigator.clipboard.writeText(contentToCopyChecked).then(() => {
      setCurrentIcon(checkIconName);
      setTimeout(() => {
        setCurrentIcon(copyIconName);
      }, timeToSeeCheckIconAfterCopy);
    });
  }, [targetElement, keyName]);

  return (
    <BdsIcon
      onClick={handleCopy}
      name={currentIcon}
      size={size}
      class={completelyClassName}
      style={iconStyle}
    />
  );
};
