/* eslint-disable @typescript-eslint/naming-convention */
export interface AlarmaInterface {
  GatewayID?: number;
  DeviceType?: number;
  Data: {
    DataType?: number;
    DeviceID?: number;
    Password?: number;
    BatteryVoltage?: number;
    Signal?: number;
    LockStatus?: number; // 0 si esta abajo 1 si fue levantada
    CarDetected?: number; // 0 sin auto 1 con auto
    BatteryFault?: number; // 0 si es normal 1 si esta baja
  };
}

export interface AlarmaObjectInterface {
  status: string;
  batteryFault: string;
}
