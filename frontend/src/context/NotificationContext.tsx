import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type NotificationType =
  | "success"
  | "error";

type Notification = {
  id: string;

  message: string;

  type: NotificationType;
};

type NotificationContextType = {
  showNotification: (
    message: string,
    type?: NotificationType,
  ) => void;
};

const NotificationContext =
  createContext<
    NotificationContextType | undefined
  >(undefined);

export function NotificationProvider({
  children,
}: PropsWithChildren) {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const showNotification = (
    message: string,
    type: NotificationType =
      "success",
  ) => {
    const notificationId =
      crypto.randomUUID();

    const notification: Notification = {
      id: notificationId,

      message,

      type,
    };

    setNotifications((previous) => [
      ...previous,

      notification,
    ]);

    setTimeout(() => {
      setNotifications((previous) =>
        previous.filter(
          (item) =>
            item.id !== notificationId,
        ),
      );
    }, 3000);
  };

  const value = useMemo(
    () => ({
      showNotification,
    }),

    [],
  );

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}

      {/* Toast Container */}
      <div className="fixed right-5 top-5 z-[100] space-y-3">
        {notifications.map(
          (notification) => (
            <div
              key={notification.id}
              className={`
                min-w-[300px]
                rounded-xl
                px-5
                py-4
                text-sm
                font-medium
                text-white
                shadow-lg
                transition

                ${
                  notification.type ===
                  "success"
                    ? "bg-green-600"
                    : "bg-red-600"
                }
              `}
            >
              {notification.message}
            </div>
          ),
        )}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(
    NotificationContext,
  );

  if (!context) {
    throw new Error(
      "useNotification must be used within NotificationProvider",
    );
  }

  return context;
}