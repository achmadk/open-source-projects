import type { Messaging, Models } from "appwrite";
import type { Context } from "react";

import {
  AppwriteContext,
  type AppwriteContextType,
  useAppwrite,
} from "react-appwrite/context";

/**
 * @description payload data type for {@link useMessagingSubscriber} hooks
 * @author Achmad Kurnianto
 * @date 19/08/2024
 * @export
 * @interface SubscriberPayload
 */
export interface SubscriberPayload {
  /**
   * @description first argument of both {@link Messaging.createSubscriber} and {@link Messaging.deleteSubscriber}
   * @author Achmad Kurnianto
   * @date 19/08/2024
   * @type {string}
   * @memberof SubscriberPayload
   */
  topicId: string;

  /**
   * @description second argument of both {@link Messaging.createSubscriber} and {@link Messaging.deleteSubscriber}
   * @author Achmad Kurnianto
   * @date 19/08/2024
   * @type {string}
   * @memberof SubscriberPayload
   */
  subscriberId: string;

  /**
   * @description third argument of {@link Messaging.deleteSubscriber}
   * @author Achmad Kurnianto
   * @date 19/08/2024
   * @type {string}
   * @memberof SubscriberPayload
   */
  targetId: string;
}

/**
 * @description output data type for {@link useMessagingSubscriber} hooks.
 * @author Achmad Kurnianto
 * @date 19/08/2024
 * @export
 * @interface DefaultUseMessagingSubscriberOutput
 * @template Payload
 */
export interface DefaultUseMessagingSubscriberOutput<
  Payload extends SubscriberPayload = SubscriberPayload,
> {
  create(payload: Payload): Promise<Models.Subscriber>;
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  delete(payload: Omit<Payload, "targetId">): Promise<{}>;
}

export function useMessaging(Context = AppwriteContext) {
  const { messaging } = useAppwrite(Context);
  return messaging;
}

export interface DefaultUseMessagingSubscriberOptions {
  context?: Context<AppwriteContextType>;
}

/**
 * @description
 * @author Achmad Kurnianto
 * @date 19/08/2024
 * @export
 * @template Payload
 * @template Options
 * @param {Options} options
 * @returns {*}  {DefaultUseMessagingSubscriberOutput<Payload>}
 */
export function useMessagingSubscriber<
  Payload extends SubscriberPayload = SubscriberPayload,
  Options extends
    DefaultUseMessagingSubscriberOptions = DefaultUseMessagingSubscriberOptions,
>(options: Options): DefaultUseMessagingSubscriberOutput<Payload> {
  const messaging = useMessaging(options?.context);

  // @ts-expect-error
  const create = async ({ topicId, subscriberId, targetId }: Payload) =>
    await messaging.createSubscriber(topicId, subscriberId, targetId);

  const remove = async ({ topicId, subscriberId }: Omit<Payload, "targetId">) =>
    await messaging.deleteSubscriber(topicId, subscriberId);

  return {
    create,
    delete: remove,
  };
}
