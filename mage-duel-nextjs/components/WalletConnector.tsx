'use client';

import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { useEffect, useState, useCallback } from 'react'
import ControllerConnector from '@cartridge/connector/controller'
import { UnityWindow } from './UnityPlayer';


export interface ControllerWindow extends Window {
  controllerInstance: ControllerConnector;
  username: string;
  handleConnect: () => Promise<void>;
}

export function ConnectWallet() {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const controller = connectors[0] as ControllerConnector
  const [username, setUsername] = useState<string>()
  const [isRetrying, setIsRetrying] = useState(false)
  

  useEffect(() => {
    if (!address) return
    controller.username()?.then((n) => {
      setUsername(n);
      setControllerInstance(controller);
      (window as ControllerWindow).username = n;
      (window as UnityWindow).unityConnector.OnUsernameReceived(n);
    })
  }, [address, controller])

  const handleConnect = useCallback(async () => {
    try {
      await connect({ connector: controller })
      setControllerInstance(controller)
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('WebAuthn') && !isRetrying) {
        setIsRetrying(true)
        // Retry connection after a short delay
        setTimeout(() => {
          connect({ connector: controller })
          setIsRetrying(false)
        }, 100)
      }
    }
  }, [connect, controller, isRetrying])
  

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
