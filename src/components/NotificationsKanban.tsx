
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Bell, Check, X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: typeof Bell | typeof Check | typeof X;
  color: string;
  status: "unread" | "read" | "archived";
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Payment Successful",
    description: "Your last payment was processed successfully",
    time: "2 hours ago",
    icon: Check,
    color: "text-green-500",
    status: "unread"
  },
  {
    id: "2",
    title: "Failed Transaction",
    description: "Unable to process transaction #12345",
    time: "5 hours ago",
    icon: X,
    color: "text-red-500",
    status: "unread"
  },
  {
    id: "3",
    title: "Account Update",
    description: "Your account details have been updated",
    time: "1 day ago",
    icon: Bell,
    color: "text-blue-500",
    status: "read"
  },
  {
    id: "4",
    title: "Security Alert",
    description: "New login from an unknown device",
    time: "2 days ago",
    icon: Bell,
    color: "text-yellow-500",
    status: "archived"
  },
  {
    id: "5",
    title: "Subscription Renewed",
    description: "Your premium subscription has been renewed",
    time: "3 days ago",
    icon: Check,
    color: "text-green-500",
    status: "read"
  }
];

const NotificationsKanban = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("id", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: "unread" | "read" | "archived") => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, status } : notification
      )
    );
  };

  const NotificationCard = ({ notification }: { notification: NotificationItem }) => {
    const Icon = notification.icon;
    return (
      <div 
        className="bg-card p-4 rounded-lg mb-3 cursor-move shadow-sm hover:shadow-md transition-all"
        draggable
        onDragStart={(e) => handleDragStart(e, notification.id)}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 bg-muted rounded-full ${notification.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground">{notification.description}</p>
            <p className="text-xs text-muted-foreground">{notification.time}</p>
          </div>
        </div>
      </div>
    );
  };

  const filterNotificationsByStatus = (status: "unread" | "read" | "archived") => {
    return notifications.filter(notification => notification.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        className="bg-background p-4 rounded-lg"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "unread")}
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
          Unread
        </h3>
        <div className="space-y-2">
          {filterNotificationsByStatus("unread").map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      </div>

      <div 
        className="bg-background p-4 rounded-lg"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "read")}
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
          Read
        </h3>
        <div className="space-y-2">
          {filterNotificationsByStatus("read").map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      </div>

      <div 
        className="bg-background p-4 rounded-lg"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "archived")}
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <span className="h-2 w-2 bg-gray-500 rounded-full mr-2"></span>
          Archived
        </h3>
        <div className="space-y-2">
          {filterNotificationsByStatus("archived").map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsKanban;
