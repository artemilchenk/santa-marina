import MetalitixLogger from '@metalitix/metalitix-aframe';
import AircardsConfig from '../../aircards.config';
import type { Camera } from 'three';
import type { Entity } from 'aframe';

export class MtxLogger {
  private beginTimestamp: number | null = null;
  private logger: MetalitixLogger;
  private debug = false;
  private readonly delay = 4000;

  constructor(private isProvEnv: boolean) {
    this.logger = new MetalitixLogger(this.appKey, { showSurvey: false });
  }

  private get isStaging(): boolean {
    return this.isProvEnv && window.location.origin.includes('.aircards.io');
  }

  private get appKey(): string {
    const appKey = !this.isProvEnv
      ? AircardsConfig.METALITIX_DEVELOPMENT_APP_KEY
      : this.isStaging
        ? AircardsConfig.METALITIX_STAGING_APP_KEY
        : AircardsConfig.METALITIX_PRODUCTION_APP_KEY;

    return appKey ?? '';
  }

  protected send(callback: () => void): void {
    if (!this.beginTimestamp) {
      console.error('MtxLogger error: session not started');

      return;
    }

    const timeDelta = Date.now() - this.beginTimestamp;

    if (timeDelta < this.delay) {
      this.printDebugMessage(`Waiting for ${this.delay - timeDelta}ms`);
      setTimeout(callback, this.delay - timeDelta);
    } else {
      callback();
    }
  }

  protected printDebugMessage(message: string): void {
    if (this.debug && !(this.isProvEnv && !this.isStaging)) {
      console.log(`%cMtxLogger debug log:\n${message}`, 'background: #fff; color: #55f; font-weight: bold;');
    }
  }

  public toggleDebugMode(debug: boolean): void {
    this.debug = debug;

    this.printDebugMessage(`Debug mode toggled: ${debug}`);
  }

  public startSessionOrChangeScene(scene: Entity<Camera> | undefined): void {
    if (!scene?.closestScene) {
      console.error('No scene found');

      return;
    }

    if (this.logger.cameraOrScene) {
      this.logger.cameraOrScene = scene;

      this.printDebugMessage('Scene changed');
    } else {
      this.logger.startSession(scene);

      this.beginTimestamp = Date.now();

      this.printDebugMessage('Session started');
    }
  }

  public setAttribute(attribute: string, value: string): void {
    this.send(() => {
      this.logger.setAttribute(attribute, value);
      this.printDebugMessage(`Attribute set: ${attribute} - ${value}`);
    });
  }

  public logEvent(eventName: string, eventValue: string): void {
    this.send(() => {
      this.logger.logEvent(eventName, eventValue);
      this.printDebugMessage(`Event logged: ${eventName} - ${eventValue}`);
    });
  }

  public logState(stateName: string, stateValue: string): void {
    this.send(() => {
      this.logger.logState(stateName, stateValue);
      this.printDebugMessage(`State logged: ${stateName} - ${stateValue}`);
    });
  }
}
