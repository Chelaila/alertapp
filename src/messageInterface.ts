/* eslint-disable @typescript-eslint/naming-convention */
export interface MessageInterface {
  UUID: string;
  DeviceType: number; // Estatico
  Data: {
    DeviceID: number; // Id del Dispositivo
    Password: number; // Password
    Command: number; // Comando
    Parameter: number; // Estatico
  };
}
