import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ConfigurationData } from '../e/configurations';
import { differenceInSeconds } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  constructor(
    private lastRefresh: Date = new Date(),
    private configurationIndex: Map<string, ConfigurationData[]> = new Map(),
    private minimumRefreshPeriodThreshold: number = 10
  ) { }

  refreshConfigurations(): Observable<boolean> {
    if (differenceInSeconds(new Date(), this.lastRefresh) > this.minimumRefreshPeriodThreshold) {
      this.lastRefresh = new Date();
      this.configurationIndex = this._mockConfigurations();
    }
    return of(true);
  }

  private async _safeGetConfz(): Promise<Map<string, ConfigurationData[]>> {
    const p: Promise<boolean> = new Promise((ret, rej) => {
      this.refreshConfigurations().subscribe((result) => {
        ret(result);
      });
    });
    await p;
    return this.configurationIndex;
  }

  async getConfiguration(
    configTableName: string,
    drivingConfigTableName?: string,
    drivingValue?: string
  ): Promise<ConfigurationData[]> {
    var ret: ConfigurationData[] | undefined = (await this._safeGetConfz()).get(configTableName);
    if (ret === undefined) {
      return [];
    }

    if (drivingConfigTableName && drivingValue) {
      return ret.filter((aCD) => {
        return (aCD
          && aCD.binding
          && aCD.binding.length > 0
          && aCD.binding.filter((aBinding) => {
            return aBinding.key === drivingConfigTableName && aBinding.value === drivingValue
          }).length > 0)
      });
    }
    else {
      return ret;
    }
  }

  private _mockConfigurations(): Map<string, ConfigurationData[]> {
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
