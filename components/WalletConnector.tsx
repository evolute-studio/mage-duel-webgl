export type ControllerWindow = Window & {
  controllerInstance: ControllerConnector;
  username: string;
  account?: AccountInterface;
  handleConnect: () => Promise<void>;
} 

(window as ControllerWindow).username = n;
if (account) (window as ControllerWindow).account = account;
(window as UnityWindow).unityConnector.OnUsernameReceived(n); 