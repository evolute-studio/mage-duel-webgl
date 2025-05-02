'use client';

import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { useEffect, useState, useCallback } from 'react'
import ControllerConnector from '@cartridge/connector/controller'
import { UnityWindow } from './UnityPlayer';
import { AccountInterface } from 'starknet';

export interface ControllerWindow extends Window {
  controllerInstance: ControllerConnector;
  username: string;
  account: AccountInterface;
  handleConnect: () => Promise<boolean>;
}

export function ConnectWallet() {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, account } = useAccount()
  const controller = connectors[0] as ControllerConnector
  const [username, setUsername] = useState<string>()
  const [isRetrying, setIsRetrying] = useState(false)
  

  useEffect(() => {
    if (!address) return
    controller.username()?.then((n) => {
      setUsername(n);
      setControllerInstance(controller);
      (window as ControllerWindow).username = n;
      if (account) {
        (window as ControllerWindow).account = account;
      }
      (window as UnityWindow).unityConnector.OnUsernameReceived(n);
      (window as UnityWindow).unityConnector.OnControllerLogin();

    })
  }, [address, account, controller])

  const handleConnect = useCallback(async () => {
    if (address || account) {
      console.log('Controller already connected');
      return true;
    }
    try {
      await connect({ connector: controller });
      setControllerInstance(controller);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('WebAuthn') && !isRetrying) {
        setIsRetrying(true)
        setTimeout(() => {
          connect({ connector: controller })
          setIsRetrying(false)
        }, 100)
      }
    }
    return false;
  }, [connect, controller, isRetrying, address, account])
  

  useEffect(() => {
    (window as ControllerWindow).handleConnect = handleConnect;
  }, [handleConnect]);

  return (
    <div className="wallet-connect" style={{ position: 'absolute', top: '10px', right: '10px' }}>
      {address && (
        <>
          <p>Wallet Address: {address}</p>
          {username && <p>Username: {username}</p>}
        </>
      )}
      {address ? (
        <button onClick={() => disconnect()}>Disconnect Wallet</button>
      ) : (
        <button onClick={handleConnect} disabled={isRetrying}>
          {isRetrying ? 'Retrying...' : 'Connect Wallet'}
        </button>
      )}

    </div>
  )
} 

export function setControllerInstance(controller: ControllerConnector) {
  (window as ControllerWindow).controllerInstance = controller;
}
