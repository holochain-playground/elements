import { RowOrColumnItemConfig } from 'golden-layout';
import { CollectionElement } from '../utils/collection-element';
import { GetContent } from '../utils/get-content';

export class GoldenLayoutColumn
  extends CollectionElement
  implements GetContent
{
  async getContent(): Promise<RowOrColumnItemConfig> {
    return {
      type: 'column',
      content: await this.getCollectionContent(),
      ...this.getCommonConfig(),
    };
  }
}
