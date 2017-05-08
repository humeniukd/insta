import {describe, it} from 'mocha';
import EventsMapper from './events.mapper';

describe('Mapper: Events', () => {
  describe('#mapModelToDto()', () => {
    it('maps model to dto', () => {
      const model = {
        createdBy: {
          _id: '123',
          userName: 'creator userName',
          avatar: 'link to avatar'
        },
        subscribers: ['123', '456']
      };

      const context = {
        _id: '123'
      };

      const dto = EventsMapper.mapModelToDto(model, context);

      expect(dto).toHaveProperty('currentUserIsOwner', true);
      expect(dto).toHaveProperty('currentUserIsSubscribed', true);
    });
  });
});
