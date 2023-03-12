import React from 'react';
import { ViewProps } from 'mui-edit/types';
import { SectionData, SectionSettings } from './Section';
import MediaImage from '../MediaImage';

const SectionView: React.FunctionComponent<
  ViewProps<SectionData, SectionSettings>
> = (props) => {
  const {
    data,
  } = props;

  return (
    <div className='px-4 py-4'>
      {data.image && (
        <div className='relative aspect-video'>
          <MediaImage
            className='object-cover'
            data={data.image}
            fill
          />
        </div>
      )}
      {data.title.length > 0 && (
        <h2
          className='text-2xl my-2 font-extrabold uppercase font-sans'
        >
          {data.title}
        </h2>
      )}
      <div className='whitespace-pre-line'>
        {data.body}
      </div>
      {data.cards.length > 0 && (
        <div className='w-full overflow-auto my-4'>
          <div className='inline-flex gap-4'>
            {data.cards.map((card) => {
              return (
                <div className='w-48'>
                  {card.data.image && (
                    <MediaImage
                      className='object-cover h-32 w-full'
                      width={192}
                      height={128}
                      data={card.data.image}
                    />
                  )}
                  <h3 className='text-2xl font-bold my-2'>
                    {card.data.title}
                  </h3>
                  <p>
                    {card.data.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionView;
