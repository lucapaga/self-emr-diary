import { Injectable } from '@angular/core';
import { ConfigurationData } from '../e/configurations';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  constructor(
    private lastRefresh: Date,
    private configurationIndex: Map<string, ConfigurationData[]>
  ) { }

  refreshConfigurations() {
    this.configurationIndex = this._mockConfigurations();
  }

  getConfigurations(configTableName: string): ConfigurationData[] {
    var ret: ConfigurationData[] | undefined = this.configurationIndex.get(configTableName);
    if (ret === undefined) {
      return [];
    }
    return ret;
  }
  
  private _mockConfigurations():Map<string, ConfigurationData[]> {
    var ret = new Map();
    ret.set("matter", [
      { key: "matter", value: "Urine", icon: "wc" },
      { key: "matter", value: "Parametri Corporei", icon: "accessibility_new" }
    ]);
    ret.set("measure", [
      { key: "measure", value: "Volume", icon: "water", binding: [{ key: "matter", value: "Urine" }] },
      { key: "measure", value: "Temperatura", icon: "thermostat", binding: [{ key: "matter", value: "Parametri Corporei" }] },
      { key: "measure", value: "Peso", icon: "monitor_weight", binding: [{ key: "matter", value: "Parametri Corporei" }] }
    ]);
    return ret;
  }
}
