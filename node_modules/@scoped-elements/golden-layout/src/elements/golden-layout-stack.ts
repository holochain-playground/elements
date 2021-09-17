import { ComponentItemConfig, StackItemConfig } from 'golden-layout';
import { CollectionElement } from '../utils/collection-element';
import { GetContent } from '../utils/get-content';

export class GoldenLayoutStack extends CollectionElement implements GetContent {
  async getContent(): Promise<StackItemConfig> {
    return {
      type: 'stack',
      content: (await this.getCollectionContent()) as ComponentItemConfig[],
      ...this.getCommonConfig(),
    };
  }
}
