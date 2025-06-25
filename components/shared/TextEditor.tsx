'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef } from 'react';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false
});

const TextEditor = ({
  state,
  setState,
  buttons
}: {
  state: any;
  setState: (state: any) => void;
  buttons?: string[];
}) => {
  const editor = useRef(null);

  const config = useMemo(
    () => {
      const configs: any = {
        readonly: false,
        uploader: {
          insertImageAsBase64URI: true,
          imagesExtensions: ['jpg', 'png', 'jpeg', 'gif']
        }
      };

      if (buttons) {
        configs.buttons = buttons;
      }

      return configs;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <JoditEditor
      ref={editor}
      value={state}
      config={config}
      onBlur={(newContent) => {
        setState(newContent);
      }} // preferred to use only this option to update the content for performance reasons
      // onChange={newContent => console.log({ content: newContent })}
    />
  );
};

export default TextEditor;
