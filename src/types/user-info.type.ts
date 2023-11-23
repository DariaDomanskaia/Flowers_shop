import {DeliveryType} from "./delivery.type";
import {paymentType} from "./payment.type";

export type UserInfoType = {
  deliveryType?: DeliveryType,
  firstName?: string,
  lastName?: string,
  phone?: string,
  fatherName?: string,
  paymentType?: paymentType,
  email: string,
  street?: string,
  house?: string,
  entrance?: string,
  apartment?: string,

}
