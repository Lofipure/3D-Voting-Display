import React, { useEffect } from 'react';
import Global from './Global.class';

const Show: React.FC = () => {
  useEffect(() => {
    new Global({
      backgroundColor: '#ffffff',
      name: 'Text',
      options: [
        {
          label: 'Test One',
          selectionResult: [
            {
              id: 1,
              label: '1',
              selectedNumber: 12,
            },
            {
              id: 2,
              label: '2',
              selectedNumber: 15,
            },
          ],
        },
        {
          label: 'Test Two',
          selectionResult: [
            {
              id: 3,
              label: '3',
              selectedNumber: 2,
            },
            {
              id: 4,
              label: '4',
              selectedNumber: 15,
            },
          ],
        },
      ],
    });
  });
  return <div></div>;
};

export default Show;
