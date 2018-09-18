import { IRenderMime } from "@jupyterlab/rendermime-interfaces";
import { Widget } from "@phosphor/widgets";
import * as React from "react";
import * as ReactDOM from "react-dom";
import WidgetBase from "./Components/WidgetBase";

const CLASS_NAME = "mimerenderer-cx";
const CSS_CLASS = "jp-RenderedCX";

import cx2cyjs from "./Utilities/cx2cyjs";

class CytoscapejsWidget extends Widget implements IRenderMime.IRenderer {

  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
    this.addClass(CSS_CLASS);
  }

  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let rawData = model.data[this._mimeType] as any;
      const metadata = (model.metadata[this._mimeType] as any) || {};

      console.log("* Model data", rawData, metadata);
      const data: any = cx2cyjs(rawData);

      console.log("* Converted", data.elements, data.style);
      let networkName = "N/A";
      // var keys = Object.keys(rawData);
      // for (let i = 0; i < keys.length; i++) {
      //   if ("networkAttributes" in rawData[i]) {
      //     networkname = rawData[i].networkAttributes[0].v;
      //   }
      // }
      const props = {
        data,
        metadata,
        theme: "cm-s-jupyter",
        networkName
      };
      const component = <WidgetBase {...props} />;
      ReactDOM.render(component, this.node, () => {
        resolve();
      });
    });
  }

  private readonly _mimeType: string;
}

export default CytoscapejsWidget;
