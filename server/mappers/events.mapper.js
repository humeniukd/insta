/**
 * @swagger
 * definition:
 *   Event:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       capacity:
 *         type: number
 *       subscribers:
 *         type: array
 *         default: []
 *         items:
 *           - type: string
 *       recurrence:
 *         type: boolean
 *         default: false
 *       recurrenceType:
 *         type: string
 *       price:
 *         type: string
 *       currency:
 *         type: string
 *         default: "PLN"
 *       groupId:
 *         type: number
 *       recurrenceStartDate:
 *         type: date
 *       recurrenceEndDate:
 *         type: date
 *       startDate:
 *         type: date
 *       endDate:
 *         type: date
 *       location:
 *         title: Location [lng, lat]
 *         type: array
 *         default: [10, 10]
 *         items:
 *           - type: number
 *       locationName:
 *         type: string
 *       category:
 *         type: string
 *         default: "577a085114b9fc9b04640810"
 *       createdAt:
 *         type: date
 *       createdBy:
 *         type: object
 *         properties:
 *            _id:
 *                type: string
 *            userName:
 *                type: string
 *            avatar:
 *                type: string
 *       currentUserIsOwner:
 *         type: boolean
 *       currentUserIsSubscribed:
 *         type: boolean
 */

export default {
  mapModelToDto,
};

function mapModelToDto(model, contextUser) {
  let dto = Object.assign({}, model);

  dto.currentUserIsOwner = String(dto.createdBy._id) === String(contextUser._id);
  dto.currentUserIsSubscribed = dto.subscribers.find((item) => {
    return String(item) === String(contextUser._id);
  }) !== undefined;

  return dto;
}
