/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import * as mqtt from 'mqtt/dist/mqtt';
import { AlarmaInterface } from '../../alarmaInterface';
import { MessageInterface } from '../../messageInterface';
import { commands } from '../../alarmaConstants';
import { ALARMAS } from '../../ALARMA';
@Component({
  selector: 'app-alarma-page',
  templateUrl: './alarma.page.html',
  styleUrls: ['./alarma.page.scss'],
})
export class AlarmaPage implements OnInit {
  alarmas=ALARMAS;
  alarma: AlarmaInterface;
  //alarmas: Array<AlarmaInterface>;
  options = {
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    // Authentication information
    clean: true,
    reconnectPeriod: 3000,
    connectTimeout: 10 * 1000,
    hostname: 'localhost',
    port: 8080,
  };
  // const urlServe = 'ws://26.88.137.233';
  client: mqtt.MqttClient = mqtt.connect(this.options);
  constructor() {
  }
  ngOnInit(){
    // TODO document why this method 'ngOnInit' is empty
  }
  populateList(){
    // client.subscribe('/up_link_data', (err) => {
    //   client.on('message', (topic, message) => {
    //     // message is Buffer
    //     // agregar a la lista nueva alarma suscrita al topico si existe el deviceID en la lista
    //     // Si algun objeto de la lista con el mismo id cambia el valor position state cambiar el color del icono
    //     // al bajar o subir la alarma esta deberia enviar una publicacion al topico que agregara una nueva alarma
    //     // lo cual sirve para comparar y agregar a la lista
    //     console.log(message.toString());
    //     const msg = JSON.parse(message.toString());
    //     this.alarmas = [msg];
    //     client.end();
    //   });
    // });
  }
  changueState(){
    const alarmaPicked = this.alarma;
    const comando = alarmaPicked.Data.LockStatus === 0 ? commands['Lock Up'] : commands['Lock Down'];
    const message: MessageInterface = {
      UUID: alarmaPicked.GatewayID.toString(),
      DeviceType: alarmaPicked.DeviceType, // Estatico
      Data: {
        DeviceID: alarmaPicked.Data.DeviceID, // Id del Dispositivo
        Password: alarmaPicked.Data.Password, // Password
        Command: comando, // Comando
        Parameter: 0, // Estaticos
      },
    };
    this.sendData(message);
  }
  pickAlarma(alarma: AlarmaInterface){
    this.alarma = alarma;
    const status = alarma.Data.LockStatus === 0 ? 'Conectado' : 'Usado';
    const batteryFault = alarma.Data.BatteryFault === 0 ? 'normal' : 'low';
    const batteryImg = document.createElement('img');
    batteryImg.src = `../../../assets/${batteryFault}.svg`;
    batteryImg.id = batteryFault;
    const name = document.getElementById('alarmName');
    const state = document.getElementById('alarmState');
    const alarmBateryPercent = document.getElementById('alarmBatteryPercent');
    name.innerHTML = this.alarma.GatewayID.toString();
    state.innerHTML = status;
    alarmBateryPercent.setAttribute('src', `../../../assets/${batteryFault}.svg`);
    console.log(this.alarma);
  }
  sendData(messageAlarma: MessageInterface) {
    const msg = JSON.stringify(messageAlarma);
    const options = {
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
      // Authentication information
      clean: true,
      reconnectPeriod: 3000,
      connectTimeout: 10 * 1000,
      hostname: '26.211.96.99',
      port: 9001,
    };
    // const urlServe = 'ws://26.88.137.233';
    const client: mqtt.MqttClient = mqtt.connect(options);
    client.subscribe('/down_link_data', (err) => {
      if (!err) {
        client.publish('/down_link_data', msg); // No deja de enviar si no lo logra
      }
      else {
        console.log(err);
      }
    });
    client.on('message', (topic, message) => {
      // message is Buffer
      console.log(message.toString());
      client.end();
    });
  }
}
