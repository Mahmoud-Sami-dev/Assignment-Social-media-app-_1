export interface INotificationProvider {

    /**
     *
     * @param token ex :FCM token in case firebase service
     * @param data : object contain push notification data
     */
    send(token: string, data: { title: string, body: string }): Promise<void>;
}
