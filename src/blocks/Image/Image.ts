import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';
import { ImageData } from '@/blocks/Image/types/ImageData';
import { ImageSettings } from '@/blocks/Image/types/ImageSettings';
import ImageView from '@/blocks/Image/ImageView';
import ImageEditForm from '@/blocks/Image/ImageEditForm';
import ImageSettingsForm from '@/blocks/Image/ImageSettingsForm';

const Image = (uploadFn: (f: Blob) => Promise<string>): BlockTypeInterface<ImageData, ImageSettings> => {
  return {
    id: 'image',
    hasSettings: true,
    defaultSettings: {
      maxWidth: 'lg',
      height: 'initial',
    },
    blockLabel(data: ImageData): string {
      return data.title.length > 0 ? data.title : 'Unnamed image';
    },
    editForm: ImageEditForm(uploadFn),
    label: 'Image',
    settingsForm: ImageSettingsForm,
    view: ImageView,
    defaultData: {
      alt: '',
      title: '',
      src: '',
    },
  };
};

export default Image;
